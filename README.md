![POLITICO](https://rawgithub.com/The-Politico/src/master/images/logo/badge.png)

# django-budget

TK.

### Configuring users

django-budget uses Django's standard `User` auth model to associate people with projects. You can, however, set custom roles to determine who is a developer, editor or reporter in your system.

Set custom attribute calls on the user model in your settings. The attributes should return a boolean value that determines that user's available roles.

This lets you extend the `User` model elsewhere in your project and use custom attributes to determine roles in the budget.

Say, for example, you had a model like this:

```python
class Profile(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  is_reporter = models.BooleanField(default=False)
  # ... etc.
```

You could set the reporter attribute in your project settings like this:

```python
BUDGET_REPORTER_ATTR = 'profile.is_reporter'
```

Here are the defaults:

```python
BUDGET_REPORTER_ATTR = 'is_staff'
BUDGET_EDITOR_ATTR = 'is_staff'
BUDGET_DEVELOPER_ATTR = 'is_superuser'
```

### Setting up Slack notifications

You can configure periodic notifications to Slack from your budget boards.

First add some configuration variables to your project settings:

```python
BUDGET_SLACK_TOKEN = os.getenv('BUDGET_SLACK_TOKEN')  # A Slack API token
BUDGET_DOMAIN = 'http://localhost:8000'  # The root domain of your hosted app
```

For each board you want to send the status of, add a Slack channel slug to the model.

```python
a_board.slack_channel = '#my-channel'
```

Then configure a process on your server to call the Slack notification management command with the slugs of any board you want to send the status of:

```
$ python manage.py budget_board_status slug-of-a-board another-board
```
