import subprocess
import tempfile
import xml.etree.ElementTree as ET
import os


class CheckstyleAnalyzer:
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
                        "checkstyle-10.21.2-all.jar",
                        "-c",
                        "/google_checks.xml",
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
