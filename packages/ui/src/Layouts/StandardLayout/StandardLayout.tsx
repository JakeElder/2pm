import React from "react";
import css from "./StandardLayout.module.css";
import Background from "../../Components/Background";
import { backgrounds } from "../../images";

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: RootProps) => {
  return (
    <Background src={backgrounds.UNIVERSE.src}>
      <div className={css["root"]}>{children}</div>
    </Background>
  );
};

/*
 * UserAndLeaderboard
 */

type UserAndLeaderboardProps = {
  children: React.ReactNode;
};

export const UserAndLeaderboard = ({ children }: UserAndLeaderboardProps) => {
  return <div className={css["user-and-leaderboard"]}>{children}</div>;
};

/*
 * User
 */

type UserProps = {
  children: React.ReactNode;
};

export const User = ({ children }: UserProps) => {
  return <div className={css["user"]}>{children}</div>;
};

/*
 * Leaderboard
 */

type LeaderboardProps = {
  children: React.ReactNode;
};

export const Leaderboard = ({ children }: LeaderboardProps) => {
  return <div className={css["leaderboard"]}>{children}</div>;
};

/*
 * CompanionOneToOne
 */

type CompanionOneToOneProps = {
  children: React.ReactNode;
};

export const CompanionOneToOne = ({ children }: CompanionOneToOneProps) => {
  return <div className={css["companion-one-to-one"]}>{children}</div>;
};

/*
 * WorldRoom
 */

type WorldRoomProps = {
  children: React.ReactNode;
};

export const WorldRoom = ({ children }: WorldRoomProps) => {
  return <div className={css["world-room"]}>{children}</div>;
};
