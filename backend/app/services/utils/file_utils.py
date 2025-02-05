import os

# Common binary and non-programming file extensions to skip
DISALLOWED_EXTENSIONS = {
    # Binary formats
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    # Images
    ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".ico", ".svg",
    # Audio/Video
    ".mp3", ".mp4", ".wav", ".avi", ".mov", ".wmv",
    # Archives
    ".zip", ".rar", ".7z", ".tar", ".gz",
    # Other binary
    ".exe", ".dll", ".so", ".dylib", ".bin",
    # Design files
    ".psd", ".ai", ".sketch"
}

def should_skip_file(filename):
    """Check if the file should be skipped based on extension"""
    ext = os.path.splitext(filename)[1].lower()
    return ext in DISALLOWED_EXTENSIONS
