#!/bin/bash
# Script to run the backend server

# Get the directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Navigate to the backend directory
cd "$DIR"

# Activate the virtual environment
source .venv/bin/activate

# Start the uvicorn server
uvicorn main:app --reload --port 8002
