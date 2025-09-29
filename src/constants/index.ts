import {
  DASHBOARD,
  REPORTS,
  INDICATORS,
  OBJECTIVES,
  SETTINGS,
  OUTCOME,
} from "@/constants/page-path";
import {
  FolderIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { System } from "@/types";
import { CiFacebook } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { AiOutlineYoutube } from "react-icons/ai";
import { CiLinkedin } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";
import { LuStethoscope } from "react-icons/lu";

export const navigation = [
  { name: "Dashboard", href: DASHBOARD, icon: MdOutlineDashboard },
  { name: "Outcomes", href: OBJECTIVES, icon: UsersIcon },
  // { name: "Objectives", href: OBJECTIVES, icon: UsersIcon },
  { name: "Indicators", href: INDICATORS, icon: FolderIcon },
  { name: "Reports", href: REPORTS, icon: LuStethoscope },
];

export const system: System[] = [
  {
    id: 1,
    name: "Settings",
    href: SETTINGS,
    initial: "S",
    current: false,
  },
];

export const socials = [
  { icon: CiFacebook, href: "#" },
  { icon: FaXTwitter, href: "#" },
  { icon: FaInstagram, href: "#" },
  { icon: AiOutlineYoutube, href: "#" },
  { icon: CiLinkedin, href: "#" },
];

export const legals = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms and Condition", href: "#" },
  { label: "Contact", href: "#" },
];

export const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];