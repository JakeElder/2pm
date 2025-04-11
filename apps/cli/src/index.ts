#!/usr/bin/env bun

import { Command } from "commander";
import { db, generate, vector } from "./commands";

// Create the root command
const niko = new Command("niko");

// Add the command groups
niko.addCommand(generate);
niko.addCommand(db);
niko.addCommand(vector);

// Parse the arguments
niko.parse(process.argv);
