import type { CookieOptions, Request, Response } from "express";
import {
  signupService,
  loginService,
} from "../services/auth.service";

function getTokenCookieOptions(req: Request): CookieOptions {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const isForwardedHttps = Array.isArray(forwardedProto)
    ? forwardedProto.includes("https")
    : forwardedProto?.split(",").map((value) => value.trim()).includes("https");
  const isHttps = req.secure || Boolean(isForwardedHttps);
  const cookieDomain = process.env.COOKIE_DOMAIN;

  return {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  };
}

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

    const result = await signupService({
      name,
      email,
      password,
    });
    res.cookie("token", result.token, getTokenCookieOptions(req));

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.user,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const result = await loginService({
      email,
      password,
    });

    const token = (result as any).token;
    if (token) {
      res.cookie("token", token, getTokenCookieOptions(req));
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result.user,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", getTokenCookieOptions(req));

  res.json({
    message: "Logged out",
  });
};