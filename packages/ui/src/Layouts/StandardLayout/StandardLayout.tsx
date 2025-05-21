"use client";

import React from "react";
import css from "./StandardLayout.module.css";
import { useSpring, animated } from "@react-spring/web";

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: RootProps) => {
  return (
    <div className={css["root"]} data-root>
      {children}
    </div>
  );
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
 * SiteMapContainer
 */

type SiteMapContainerProps = {
  children: React.ReactNode;
  open: boolean;
};

export const SiteMapContainer = ({ children, open }: SiteMapContainerProps) => {
  const spring = useSpring({
    flexBasis: open ? 220 : 0,
    config: {
      mass: 0.5,
      tension: 160,
      friction: 20,
    },
  });

  return (
    <animated.div className={css["site-map-container"]} style={spring}>
      <div className={css["site-map-border"]} />
      {children}
    </animated.div>
  );
};

/*
 * SiteMap
 */

type SiteMapProps = {
  children: React.ReactNode;
};

export const SiteMap = ({ children }: SiteMapProps) => {
  return <div className={css["site-map"]}>{children}</div>;
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
 * Library
 */

type LibraryProps = {
  children: React.ReactNode;
};

export const Library = ({ children }: LibraryProps) => {
  return <div className={css["library"]}>{children}</div>;
};

/*
 * User Spaces
 */

type UserSpaces = {
  children: React.ReactNode;
};

export const UserSpaces = ({ children }: UserSpaces) => {
  return <div className={css["user-spaces"]}>{children}</div>;
};

/*
 * Narratives
 */

type NarrativesProps = {
  children: React.ReactNode;
};

export const Narratives = ({ children }: NarrativesProps) => {
  return <div className={css["narratives"]}>{children}</div>;
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
 * Reference
 */

type ReferenceProps = {
  children: React.ReactNode;
};

export const Reference = ({ children }: ReferenceProps) => {
  return <div className={css["reference"]}>{children}</div>;
};

/*
 * Divider
 */

type DividerProps = {};

export const Divider = ({}: DividerProps) => {
  return <div className={css["divider"]} />;
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
 * UsersContainer
 */

type UsersContainerProps = {
  children: React.ReactNode;
  open: boolean;
};

export const UsersContainer = ({ children, open }: UsersContainerProps) => {
  const spring = useSpring({
    flexBasis: open ? 220 : 0,
    config: {
      mass: 0.5,
      tension: 160,
      friction: 20,
    },
  });

  return (
    <animated.div className={css["users-container"]} style={spring}>
      <div className={css["users-border"]} />
      {children}
    </animated.div>
  );
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
