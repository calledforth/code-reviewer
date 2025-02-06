import subprocess
import tempfile
import xml.etree.ElementTree as ET
import os


class CheckstyleAnalyzer:
    # Update paths to use resources/checkstyle directory
    BASE_DIR = os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    )
    CHECKSTYLE_DIR = os.path.join(BASE_DIR, "resources", "checkstyle")
    CHECKSTYLE_JAR = os.path.join(CHECKSTYLE_DIR, "checkstyle-10.21.2-all.jar")
    CHECKSTYLE_CONFIG = os.path.join(CHECKSTYLE_DIR, "google_checks.xml")

    def __init__(self):
        print(f"Base directory: {self.BASE_DIR}")
        print(f"Checkstyle directory: {self.CHECKSTYLE_DIR}")
        print(f"Looking for jar at: {self.CHECKSTYLE_JAR}")
        print(f"Looking for config at: {self.CHECKSTYLE_CONFIG}")

        # Create checkstyle directory if it doesn't exist
        os.makedirs(self.CHECKSTYLE_DIR, exist_ok=True)

        # Check for required files
        # self.CHECKSTYLE_JAR = "C:/Users/rajku/OneDrive/Documents/ClePro/code-reviewer/backend/resources/checkstyle/checkstyle-10.21.2-all.jar"
        if not os.path.exists(self.CHECKSTYLE_JAR):
            raise FileNotFoundError(
                f"Checkstyle JAR not found at {self.CHECKSTYLE_JAR}\n"
                "Please:\n"
                "1. Download from: https://github.com/checkstyle/checkstyle/releases/download/checkstyle-10.21.2/checkstyle-10.21.2-all.jar\n"
                f"2. Save to: {self.CHECKSTYLE_JAR}"
            )
        if not os.path.exists(self.CHECKSTYLE_CONFIG):
            raise FileNotFoundError(
                f"Google checks config not found at {self.CHECKSTYLE_CONFIG}\n"
                "Please:\n"
                "1. Download from: https://raw.githubusercontent.com/checkstyle/checkstyle/master/src/main/resources/google_checks.xml\n"
                f"2. Save to: {self.CHECKSTYLE_CONFIG}"
            )

    def analyze(self, content, filename):
        """Run checkstyle analysis on a single file"""
        if not filename.endswith(".java"):
            return []

        try:
            # Create temp file with content
            with tempfile.NamedTemporaryFile(
                mode="w", suffix=".java", delete=False
            ) as temp_file:
                temp_file.write(content)
                temp_file.flush()

                # Verify content was written
                with open(temp_file.name, "r") as f:
                    written_content = f.read()
                    print(
                        f"Content written to temp file ({len(written_content)} chars)"
                    )

                # Run checkstyle with absolute path
                abs_path = os.path.abspath(temp_file.name)
                result = subprocess.run(
                    [
                        "java",
                        "-jar",
                        self.CHECKSTYLE_JAR,
                        "-c",
                        self.CHECKSTYLE_CONFIG,
                        abs_path,
                    ],
                    capture_output=True,
                    text=True,
                )

                print(f"Checkstyle stdout: {result.stdout}")
                print(f"Checkstyle stderr: {result.stderr}")

                return self._parse_checkstyle_output(result.stdout)

        except Exception as e:
            print(f"Checkstyle analysis failed for {filename}: {str(e)}")
            return []
        finally:
            try:
                os.unlink(temp_file.name)
            except:
                pass

    def _parse_checkstyle_output(self, output):
        """Parse checkstyle XML output"""
        violations = []
        if not output:
            return violations

        try:
            root = ET.fromstring(output)
            for error in root.findall(".//error"):
                violations.append(
                    {
                        "line": error.get("line"),
                        "message": error.get("message"),
                        "severity": error.get("severity"),
                    }
                )
        except ET.ParseError as e:
            print(f"Failed to parse checkstyle output: {str(e)}")
            print(f"Raw output: {output}")
        return violations
