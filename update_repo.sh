#!/bin/bash

# Change to the project directory
cd /home/dministrator/genesisnet-main/1genesisnet-main

# Check if .git directory exists
if [ ! -d ".git" ]; then
  echo "Initializing Git repository..."
  git init
  echo "Git repository initialized."
else
  echo "Git repository already exists."
fi

# Check remote configuration
REMOTE_URL=$(git config --get remote.origin.url)
if [ -z "$REMOTE_URL" ]; then
  echo "Adding remote 'origin'..."
  git remote add origin https://github.com/ntshap/genesisnet.git
  echo "Remote 'origin' added."
else
  echo "Remote 'origin' already set to: $REMOTE_URL"
  echo "Updating remote URL..."
  git remote set-url origin https://github.com/ntshap/genesisnet.git
  echo "Remote URL updated."
fi

# Check current branch
CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "No branch")
echo "Current branch: $CURRENT_BRANCH"

# If not on main branch, try to switch to it
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "Switching to main branch..."
  git checkout main 2>/dev/null || git checkout -b main
  echo "Now on branch: $(git symbolic-ref --short HEAD 2>/dev/null || echo "Unknown")"
fi

# Configure git user if not already set
GIT_USER=$(git config --get user.name)
GIT_EMAIL=$(git config --get user.email)
if [ -z "$GIT_USER" ] || [ -z "$GIT_EMAIL" ]; then
  echo "Configuring Git user..."
  git config user.name "GenesisNet User"
  git config user.email "user@example.com"
  echo "Git user configured."
fi

# Stage all changes
echo "Staging all changes..."
git add .
echo "All changes staged."

# Show status
echo "Current status:"
git status

# Commit changes
echo "Committing changes..."
git commit -m "Implement ICP Ledger payment system"
echo "Changes committed."

# Try to pull first to avoid conflicts
echo "Pulling from remote to avoid conflicts..."
git pull --no-edit origin main || echo "Pull failed. Continuing anyway..."

# Push changes
echo "Pushing changes to GitHub..."
git push -u origin main
echo "Push attempted. Check output for details."

echo "Script completed."
