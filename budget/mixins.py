from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator


class LoginRequiredMixin(object):

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(LoginRequiredMixin, self).dispatch(*args, **kwargs)


class StaffRequiredMixin(object):

    @method_decorator(staff_member_required)
    def dispatch(self, *args, **kwargs):
        return super(StaffRequiredMixin, self).dispatch(*args, **kwargs)
