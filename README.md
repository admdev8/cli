# FeatureNinjas CLI

![npm](https://img.shields.io/npm/v/@featureninjas/cli) ![npm](https://img.shields.io/npm/dm/@featureninjas/cli) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/featureninjas/cli/Node.js%20Package)

Connect a GitHub repository to FeatureNinjas to serve feature flags.

## Installation

    npm i -g @featureninjas/cli

## Usage

:warning: Note: FeatureNinjas currently only works with GitHub repositories. We're going to extend this in the near future.

Navigate to the repository that you want to connect.

    fn init

A login and authorization request will pop up in a browser window in case you run this command for the first time. `fn init` adds a web hook to your repository, and registers your repository to our backend.

## Commands

### Init - Initialize a connection between FeatureNinjas and your GitHub repository

    fn init

Adds a web hook to your repository, and registers your repository to our backend.

### Info - Shows whether the repository is connected correctly

    fn info

### Disconnect - Disconnects a repo from FeatureNinjas

    fn disconnect
