import os

from setuptools import find_packages, setup

os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name='django-kanban-budget',
    version='0.0.10',
    packages=find_packages(exclude=('example',)),
    include_package_data=True,
    license='MIT',
    url="https://github.com/The-Politico/django-kanban-budget",
    description='A Kanban-style project management app for developer-'
    'journalists in newsrooms. (Not about $$$.)',
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
    install_requires=[
        'django',
        'djangorestframework',
        'django-filter',
        'django-uuslug',
        'celery',
        'markdown',
        'PyGithub',
        'slacker',
    ]
)
