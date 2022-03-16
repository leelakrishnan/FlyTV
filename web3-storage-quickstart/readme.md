# how to upload a big file to Web3.storage via CLI

> https://docs.web3.storage/#create-the-upload-script

it took a few tries, but the trick is to remember that when interacting via Node and the CLI, when you pass in the filename, it will by default start ~/ which is your root directory. You'll need to navigate the folder structure to find our file.

## thanks to Discordian and Leela for inspiration
