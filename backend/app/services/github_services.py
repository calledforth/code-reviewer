from github import Github
from github.GithubException import GithubException
import os
from .utils.file_utils import should_skip_file
from .analysis.checkstyle_analyzer import CheckstyleAnalyzer
from .analysis.code_reviewer import CodeReviewer


class GithubService:
    def __init__(self, token, github_url, guidelines=None):
        self.github = Github(token)
        self.github_url = self._extract_repo_path(github_url)
        self.guidelines = guidelines
        self.analyzer = CheckstyleAnalyzer()
        self.reviewer = CodeReviewer()

    def _extract_repo_path(self, url):
        """Extract repository path from GitHub URL"""
        if "github.com" in url:
            parts = url.split("https://github.com/")
            url = parts[-1]

        if "/" not in url:
            raise ValueError(
                "Invalid repository path. Expected format: owner/repository"
            )
        return url

    def get_user(self):
        """Get GitHub user information"""
        try:
            user = self.github.get_user()
            return {"login": user.login, "name": user.name, "email": user.email}
        except GithubException as e:
            raise Exception(f"GitHub authentication failed: {str(e)}")

    def fetch_repo(self):
        """Fetch repository information"""
        try:
            repo = self.github.get_repo(self._extract_repo_path(self.github_url))
            return {
                "name": repo.name,
                "description": repo.description,
                "url": repo.html_url,
            }
        except GithubException as e:
            raise Exception(f"GitHub repository not found: {str(e)}")

    def extract_recursively_contents(self):
        """Extract repository contents recursively"""
        try:
            repo = self.github.get_repo(self._extract_repo_path(self.github_url))
            self.contents = self._get_contents_recursive(repo)
            return {
                "contents": self.contents,
                "has_guidelines": self.guidelines is not None,
            }
        except GithubException as e:
            raise Exception(f"Failed to extract contents: {str(e)}")

    def _get_contents_recursive(self, repo, path=""):
        """Helper method for recursive content extraction"""
        contents = []
        try:
            items = repo.get_contents(path)
            for item in items:
                if item.type == "dir":
                    contents.extend(self._get_contents_recursive(repo, item.path))
                elif item.type == "file" and not should_skip_file(item.name):
                    try:
                        content = item.decoded_content.decode("utf-8")
                        contents.append(
                            {
                                "name": item.name,
                                "path": item.path,
                                "type": item.type,
                                "content": content,
                            }
                        )
                    except UnicodeDecodeError:
                        print(f"Skipping binary file: {item.path}")
        except Exception as e:
            print(f"Error accessing {path}: {str(e)}")
        return contents

    def get_file_analysis(self, file_info):
        """Get complete analysis for a single file"""
        try:
            # Run checkstyle analysis
            checkstyle_results = self.analyzer.analyze(
                file_info["content"], file_info["name"]
            )

            # Get AI review
            review = self.reviewer.review(
                file_info, checkstyle_results, self.guidelines
            )
        
            return {"analysis": review}

        except Exception as e:
            print(f"Analysis failed for {file_info['name']}: {str(e)}")
            return {"checkstyle": [], "review": f"Analysis failed: {str(e)}"}
