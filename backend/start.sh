#!/bin/bash

echo "Starting Hospital Management System Backend..."
echo ""
echo "Make sure PostgreSQL is running and the database is set up."
echo ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000

