import os

from github import Github as gh


class Repo(object):
    def __init__(self, repo):
        self.GITHUB = repo

    def create_issue(self, title):
        return self.GITHUB.create_issue(title=title)

    def get_issue(self, title):
        for issue in self.get_issues():
            if issue.title == title:
                return issue
        return None

    def get_issues(self):
        return self.GITHUB.get_issues()

    def get_open_issues_count(self):
        return self.GITHUB.open_issues_count

    def close_issue(self, title):
        issue = self.get_issue(self.GITHUB, title)
        issue.edit(state='closed')


class Github(object):
    def __init__(
        self,
        token=os.getenv('BUDGET_GITHUB_TOKEN', None),
        person=os.getenv('BUDGET_GITHUB_PERSON', None),
        org=os.getenv('BUDGET_GITHUB_ORG', None)
    ):
        if not token:
            return
        self.TOKEN = token
        self.PERSON = person
        self.ORG = org
        self.CLIENT = self.get_client()
        self.USER = self.get_user()
        self.REPOS = self.USER.get_repos()

    def get_client(self):
        return gh(login_or_token=self.TOKEN)

    def get_user(self):
        """Get a GitHub user"""
        if self.ORG:
            return self.CLIENT.get_organization(self.ORG)
        else:
            return self.CLIENT.get_user()

    def get_repo_by_url(self, url):
        """Give this a URL and it will find you a repo. Any URL."""
        def get_url_attrs(repo):
            """Get all URL attributes on repo class."""
            return [
                attr for attr in
                repo.__class__.__dict__.keys()
                if '_url' in attr
            ]

        for repo in self.REPOS:
            for attr in get_url_attrs(repo):
                if getattr(repo, attr) == url:
                    return Repo(repo)
        return None
