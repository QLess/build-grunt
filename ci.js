const ci = {
  buildNumber: process.env.BUILD_NUMBER || 0,
  buildId: process.env.BUILD_ID || 0,
  buildBranch: process.env.BRANCH_NAME || "",
  buildUrl: process.env.BUILD_URL || "",
  buildTag: process.env.BUILD_TAG || "",
  buildChangeId: process.env.CHANGE_ID || "",
  buildChangeBranch: process.env.CHANGE_BRANCH || "",
  buildChangeTarget: process.env.CHANGE_TARGET || "",
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
    const isPullRequest = this.buildChangeId !== "";
    const isRelease = this.buildBranch === "master";
    const isReleaseCandidate =
      isPullRequest &&
      this.buildChangeTarget === "master" &&
      (this.buildChangeBranch.indexOf("release/") !== -1 ||
        this.buildChangeBranch.indexOf("hotfix/") !== -1);

    if (isLocal) {
      // Developers won't usually set these environment variables; these are
      // usually available when we run under Jenkins CI
      return "-local";
    }

    if (isRelease) {
      return "";
    }

    if (isReleaseCandidate) {
      return `-rc.${this.buildNumber}`;
    }

    const name = branch.indexOf("/") !== -1 ? branch.split("/")[1] : branch;

    return `-${name}.${this.buildNumber}.${this.buildCommitShort}`;
  },
};

module.exports = ci;
