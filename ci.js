const ci = {
  buildNumber: process.env.BUILD_NUMBER || 0,
  buildId: process.env.BUILD_ID || 0,
  buildBranch: process.env.BRANCH_NAME || "",
  buildUrl: process.env.BUILD_URL || "",
  buildTag: process.env.BUILD_TAG || "",
  buildCommit:
    process.env.GIT_COMMIT !== "" && process.env.GIT_COMMIT !== undefined
      ? process.env.GIT_COMMIT
      : "",
  buildCommitShort:
    process.env.GIT_COMMIT !== "" && process.env.GIT_COMMIT !== undefined
      ? process.env.GIT_COMMIT.substring(0, 7)
      : "",
  username: process.env.USERNAME || "jenkins",
  warNameSuffix:
    process.env.BUILD_NUMBER !== undefined
      ? "-" + process.env.BUILD_NUMBER
      : "",
  preReleaseLabel: function () {
    const branch = this.buildBranch.toLowerCase();
    const isLocal = !branch || !this.buildNumber;
    
    if (isLocal) {
      // Developers won't usually set these environment variables; these are
      // usually available when we run under Jenkins CI
      return "-local";
    }

    const isReleaseCandidate =
      (branch.indexOf("release/") || branch.indexOf("hotfix/")) &&
      process.env.CHANGE_ID;
    const isFeature = branch.indexOf("feature/") > -1;

    if (isReleaseCandidate) {
      return `-rc${this.buildNumber}`;
    }

    if (isFeature) {
      const name = branch.split("/")[1];
      return `-${name}.${this.buildNumber}.${this.buildCommitShort}`;
    }

    return ""
  },
};

module.exports = ci;
