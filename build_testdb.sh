#! /usr/bin/bash

PARENT=$(dirname "$0")
export $(grep -v '^#' $PARENT/volunteer_management_system/.env | xargs -d '\n')

if [[ $DJANGO_SETTINGS_MODULE == "volunteer_management_system.development" ]]; then
    rm $PARENT/volunteer_management_system/federal/migrations/0001_initial.py
    rm $PARENT/volunteer_management_system/incident/migrations/0001_initial.py
    rm $PARENT/volunteer_management_system/authentication/migrations/0001_initial.py
    sudo su postgres -c "psql -c 'DROP DATABASE vms;' && createdb vms"
    python $PARENT/volunteer_management_system/manage.py makemigrations federal
    python $PARENT/volunteer_management_system/manage.py makemigrations incident
    python $PARENT/volunteer_management_system/manage.py makemigrations authentication
    python $PARENT/volunteer_management_system/manage.py migrate
    python $PARENT/volunteer_management_system/manage.py populatetestdb
else
    echo "--------------------------------------------------" 1>&2;
    echo "YOU ARE IN PRODUCTION!!" 1>&2;
    echo "--------------------------------------------------" 1>&2;
fi

