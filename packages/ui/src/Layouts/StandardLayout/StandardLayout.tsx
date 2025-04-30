"use client";

import React from "react";
import css from "./StandardLayout.module.css";

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: RootProps) => {
  return <div className={css["root"]}>{children}</div>;
};

/*
 * Main
 */

type MainProps = {
  children: React.ReactNode;
};

export const Main = ({ children }: MainProps) => {
  return <div className={css["main"]}>{children}</div>;
};

/*
 * Spaces
 */

type SpacesProps = {
  children: React.ReactNode;
};

export const Spaces = ({ children }: SpacesProps) => {
  return <div className={css["spaces"]}>{children}</div>;
};

/*
 * ReferenceNarrative
 */

type ReferenceNarrativeProps = {
  children: React.ReactNode;
};

export const ReferenceNarrative = ({ children }: ReferenceNarrativeProps) => {
  return <div className={css["reference-narrative"]}>{children}</div>;
};

/*
 * PlotPoint
 */

type PlotPointProps = {
  children: React.ReactNode;
};

export const PlotPoint = ({ children }: PlotPointProps) => {
  return <div className={css["plot-point"]}>{children}</div>;
};

/*
 * Conversation
 */

type ConversationProps = {
  children: React.ReactNode;
};

export const Conversation = ({ children }: ConversationProps) => {
  return <div className={css["conversation"]}>{children}</div>;
};

/*
 * ConversationNarrative
 */

type ConversationNarrativeProps = {
  children: React.ReactNode;
};

export const ConversationNarrative = ({
  children,
}: ConversationNarrativeProps) => {
  return <div className={css["conversation-narrative"]}>{children}</div>;
};

/*
 * Users
 */

type UsersProps = {
  children: React.ReactNode;
};

export const Users = ({ children }: UsersProps) => {
  return <div className={css["users"]}>{children}</div>;
};

/*
 * InputBar
 */

type InputBarProps = {
  children: React.ReactNode;
};

export const InputBar = ({ children }: InputBarProps) => {
  return <div className={css["input-bar"]}>{children}</div>;
};

/*
 * StatusBar
 */

type StatusBarProps = {};

export const StatusBar = ({}: StatusBarProps) => {
  return <div className={css["status-bar"]} />;
};

/*
 * InfoBar
 */

type InfoBarProps = {
  children: React.ReactNode;
};

export const InfoBar = ({ children }: InfoBarProps) => {
  return <div className={css["info-bar"]}>{children}</div>;
};
