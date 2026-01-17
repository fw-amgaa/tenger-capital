"use client";

import GradientBadge from "@/components/gradient-badge";
import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useTime,
  useTransform,
} from "framer-motion";
import { PlusIcon, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

const WorkWithUs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const id = useId();
  const goldId = `gold-${id}`;
  const fillId = `fill-${id}`;

  const statsData = [
    {
      title:
        "The 2025 Growth shows that Tenger Capital is expanding rapidly, multiplied by 9.2x its transaction volume compared to it's previous year.",
      percentage: "9.2",
      unit: "x",
      suffix: "Since 2024",
      hasChart: true,
      disclosure:
        "This metric compares Tenger Capital’s total underwriting and brokerage transaction volume at the end of 2025 with the firm’s total transaction volume at the end of 2024. The comparison highlights year-on-year growth in both primary issuance and secondary market activity, reflecting the expansion of our client base, transaction capacity, and execution footprint within Mongolia’s capital markets.",

      children: (
        <div className="relative flex w-full mt-[80%] grow overflow-hidden z-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 433 383"
            className="w-full"
          >
            <mask id="arrow_grid_svg__a" fill="#fff">
              <path d="M1 0h431v383H1z"></path>
            </mask>
            <path
              fill="#fff"
              fillOpacity="0.2"
              d="M432-.5h-.998v1H432zm-2.993 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0H259.4v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.991 0h-1.995v1h1.995zm-3.99 0H95.78v1h1.995zm-3.991 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.995zm-3.991 0h-1.996v1h1.996zm-3.991 0h-1.996v1h1.996zm-3.99 0h-1.996v1h1.995zm-3.992 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.995zm-3.992 0h-1.995v1h1.995zm-3.99 0h-1.995v1h1.995zm-3.99 0H43.9v1h1.995zm-3.992 0H39.91v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.995zm-3.992 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.996zm-3.991 0h-1.995v1h1.995zm-3.99 0h-1.996v1h1.995zM9.98-.5H7.984v1H9.98zm-3.991 0H3.994v1h1.995zm-3.99 0H1v1h.998zM432-1h-.998v2H432zm-2.993 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0H259.4v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.991 0h-1.995v2h1.995zm-3.99 0H95.78v2h1.995zm-3.991 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.995zm-3.991 0h-1.996v2h1.996zm-3.991 0h-1.996v2h1.996zm-3.99 0h-1.996v2h1.995zM69.84-1h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.995zm-3.992 0h-1.995v2h1.995zm-3.99 0h-1.995v2h1.995zm-3.99 0H43.9v2h1.995zm-3.992 0H39.91v2h1.995zm-3.99 0h-1.996v2h1.996zm-3.991 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.995zm-3.992 0h-1.995v2h1.995zm-3.99 0h-1.996v2h1.996zM17.96-1h-1.995v2h1.995zm-3.99 0h-1.996v2h1.995zM9.98-1H7.984v2H9.98zM5.989-1H3.994v2h1.995zm-3.99 0H1v2h.998z"
              mask="url(#arrow_grid_svg__a)"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__b)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M1 383V0"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__c)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M36.916 383V0"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__d)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M72.834 383V0"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__e)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M108.75 383V0"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__f)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M144.666 383V0"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__g)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M180.584 383V0"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__h)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M216.5 383V0"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__i)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M252.416 383V0"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__j)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M288.334 383V0"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__k)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M324.25 383V0"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__l)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M360.166 383V0"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__m)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M396.084 383V0"
            ></path>
            <path
              stroke="url(#arrow_grid_svg__n)"
              strokeDasharray="2 2"
              strokeOpacity="0.2"
              d="M432 383V0"
            ></path>
            <defs>
              <linearGradient
                id="arrow_grid_svg__b"
                x1="1.5"
                x2="1.5"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="arrow_grid_svg__c"
                x1="37.416"
                x2="37.416"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="arrow_grid_svg__d"
                x1="73.334"
                x2="73.334"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="arrow_grid_svg__e"
                x1="109.25"
                x2="109.25"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="arrow_grid_svg__f"
                x1="145.166"
                x2="145.166"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="arrow_grid_svg__g"
                x1="181.084"
                x2="181.084"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="arrow_grid_svg__h"
                x1="217"
                x2="217"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="arrow_grid_svg__i"
                x1="252.916"
                x2="252.916"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="arrow_grid_svg__j"
                x1="288.834"
                x2="288.834"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="arrow_grid_svg__k"
                x1="324.75"
                x2="324.75"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="arrow_grid_svg__l"
                x1="360.666"
                x2="360.666"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="arrow_grid_svg__m"
                x1="396.584"
                x2="396.584"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient
                id="arrow_grid_svg__n"
                x1="432.5"
                x2="432.5"
                y1="0"
                y2="383"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fff"></stop>
                <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-[0] z-[1]">
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0px 40%, 100% 5%, 100% 100%, 0% 100%)",
                background:
                  "linear-gradient(rgba(255, 153, 0, 0.3) 0%, rgba(255, 153, 0, 0) 100%)",
              }}
            ></div>
            <div
              className="absolute top-0 left-0 h-auto w-full origin-left"
              style={{
                top: "calc(40% - 3px)",
                transform: "rotate(-17.2019deg) translate3d(0%, 0px, 0px)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 416 9"
                className="w-[97%]"
              >
                <defs>
                  <linearGradient
                    id="arrow-titan_svg__a"
                    x1="0"
                    x2="415.03"
                    y1="4.53"
                    y2="4.53"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#a16f10"></stop>
                    <stop offset="0.17" stopColor="#f90"></stop>
                    <stop offset="0.34" stopColor="#f8e5b5"></stop>
                    <stop offset="0.54" stopColor="#f90"></stop>
                    <stop offset="0.71" stopColor="#a16f10"></stop>
                    <stop offset="0.91" stopColor="#f90"></stop>
                    <stop offset="1" stopColor="#f8e5b5"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="m414.89 4.89-3.19 3.18c-.19.19-.51.19-.7 0-.2-.2-.2-.51 0-.71l2.33-2.33L0 4.97v-1l413.33.06L411 1.7c-.2-.19-.2-.51 0-.7.19-.2.51-.2.7 0l3.19 3.18c.19.19.19.51 0 .71"
                  style={{ fill: "url(#arrow-titan_svg__a)" }}
                ></path>
              </svg>
            </div>

            <div className="flex absolute top-[15%] left-[40%] z-2">
              <GradientBadge>Tenger Capital ~9.2x</GradientBadge>
            </div>
          </div>
          <div className="absolute inset-[0] z-[1]">
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0px 40%, 100% 20%, 100% 100%, 0% 100%)",
                background:
                  "linear-gradient(rgba(0, 0, 0, 0.3) 5.23%, rgba(0, 0, 0, 0) 100%)",
              }}
            ></div>
            <div
              className="absolute top-0 left-0 h-auto w-full origin-left"
              style={{
                top: "calc(40% - 3px)",
                transform: "rotate(-10.0322deg) translate3d(0%, 0px, 0px)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 407 9"
                className="w-[94%]"
              >
                <defs>
                  <linearGradient
                    id="arrow-others_svg__a"
                    x1="0"
                    x2="406.76"
                    y1="4.46"
                    y2="4.46"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#636363"></stop>
                    <stop offset="1" stopColor="#fff"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="m406.61 4.81-3.18 3.18c-.19.2-.51.2-.7 0-.2-.19-.2-.51 0-.7l2.33-2.34L0 5.44v-1l405.04-.49-2.32-2.32c-.2-.19-.2-.51 0-.71.19-.19.51-.19.7 0l3.19 3.18c.19.2.2.51 0 .71"
                  style={{ fill: "url(#arrow-others_svg__a)" }}
                ></path>
              </svg>
            </div>
          </div>
        </div>
      ),
    },
    {
      title:
        "Tenger Capital ranks second in 2025 Primary Bond Market with total volume of 379.2 Billion MNT.",
      percentage: "379.2",
      unit: "₮",
      suffix: "Billion MNT",
      labels: ["Others", "TG"],
      hasBarChart: true,
      disclosure:
        "This figure represents the total nominal value of bonds and asset-backed securities issued and successfully executed in 2025 across both the over-the-counter (OTC) market and the Mongolian Stock Exchange (MSE). It includes primary issuances completed during the year, reflecting overall market issuance activity and funding raised through Mongolia’s fixed-income capital markets.",
      children: (
        <div className="relative flex w-full h-full grow flex-nowrap items-end justify-center gap-[1.2rem] overflow-clip z-1">
          <div
            className="relative h-[65%] w-[50%] shrink-0 rounded-t-4xl"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 153, 0, 0.1) 0%, rgba(255, 153, 0, 0) 100%)",
            }}
          >
            <div className="flex w-fit items-center justify-center text-xs backdrop-blur-[20px] px-3 lg:px-4 py-2 lg:py-2 bg-[rgba(255,255,255,0.1)] absolute top-4 right-4 inline-flex h-7 rounded-2xl">
              <span className="gap-2">
                <span>Top #1</span>
              </span>
            </div>
          </div>
          <div
            className="relative w-[70%] shrink-0 rounded-t-4xl"
            style={{
              height: "max(50%, 170px)",
              background:
                "linear-gradient(180deg, rgba(255, 153, 0, 0.3) 0%, rgba(255, 153, 0, 0) 100%)",
            }}
          >
            <div className="absolute top-4 left-4  z-2">
              <GradientBadge>TG as #2</GradientBadge>
            </div>
          </div>
        </div>
      ),
    },
    {
      title:
        "Our Market Share in Primary Bond Issuance in 2025 covers 25% of the entire market.",
      percentage: "25",
      unit: "%",
      suffix: "of 2025 total issuance",
      label: "Tenger Capital",
      hasPieChart: true,
      disclosure:
        "Tenger Capital SC LLC acted as lead manager, co-manager, underwriter, or executing broker for approximately one-quarter of total primary bond issuances completed in 2025 across the OTC market and MSE. This share is calculated based on executed issuance volume, demonstrating our active role in originating, structuring, and bringing bond transactions to market.",
      children: (
        <div className="relative flex w-full h-[75%] mt-[50%] grow-1 justify-center z-1">
          <div className="absolute top-[22%] z-2">
            <GradientBadge>With Tenger Capital</GradientBadge>
          </div>

          {/* The Graph Container */}
          <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute top-0 left-0 w-full h-full"
            >
              <defs>
                <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF9900" />
                  <stop offset="50%" stopColor="#F8E5B5" />
                  <stop offset="100%" stopColor="#FF9900" />
                </linearGradient>

                <linearGradient id={fillId} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255, 153, 0, 0.4)" />
                  <stop offset="100%" stopColor="rgba(255, 153, 0, 0)" />
                </linearGradient>
              </defs>

              {/* The Area Fill */}
              <path
                d="M 0 15 
           Q 85 15, 100 100
           L 0 100
           Z"
                fill={`url(#${fillId})`}
              />

              {/* The Arch Line */}
              <path
                d="M 0 15 
           Q 85 15, 100 100"
                stroke={`url(#${goldId})`}
                style={{
                  stroke: `url(#${goldId})`,
                }}
                strokeWidth="0.3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      ),
    },
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <h2 className="text-4xl md:text-[48px] my-24 md:my-48 text-center md:w-[420px] leading-[1]">
          Why Should You Work With Us?
        </h2>
      </div>
      {/* Desktop View */}
      <div className="hidden section-container md:grid md:grid-cols-3 gap-4 xl:px-24 2xl:px-36">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Mobile View - Scrollable */}
      <div
        ref={scrollRef}
        className="md:hidden flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide ml-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="flex-shrink-0 max-w-[400px] w-full snap-center px-4 first:pl-4 last:pr-4"
          >
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Mobile Pagination Dots */}
      <div className="md:hidden flex justify-center gap-2 mt-6">
        {statsData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              scrollRef.current?.scrollTo({
                left: index * scrollRef.current.offsetWidth,
                behavior: "smooth",
              });
            }}
            className="relative"
          >
            <div
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const StatsCard = ({
  title,
  percentage,
  unit,
  suffix,
  disclosure,
  children,
}: {
  title: string;
  percentage: string;
  unit: string;
  suffix?: string;
  label?: string;
  labels?: string[];
  hasChart?: boolean;
  hasBarChart?: boolean;
  hasPieChart?: boolean;
  disclosure?: string;
  children?: React.ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const time = useTime();
  const rotate = useTransform(time, [0, 10000], [0, 360], { clamp: false });

  const rotatingBackground = useTransform(rotate, (r) => {
    return `linear-gradient(${r}deg,
      rgb(255,153,0) 15.57%,
      rgb(248,229,181) 33.39%,
      rgb(161,111,16) 50.58%,
      rgb(248,229,181) 67.75%,
      rgb(255,153,0) 91.74%)`;
  });

  return (
    <div className="w-full">
      <div className="relative aspect-3/5 rounded-4xl overflow-hidden max-w-[400px] mx-auto">
        {/* Rotating Gradient Border */}
        <motion.div
          style={{
            background: rotatingBackground,
          }}
          className="absolute inset-0 rounded-3xl"
        />

        {/* Background graph */}
        <div className="absolute w-full h-full top-0 left-0">{children}</div>

        {/* Inner Card */}
        <div className="absolute inset-[1px] bg-black rounded-4xl overflow-hidden">
          <div className="bg-[#ff990026] p-8 flex flex-col h-full relative">
            {/* Plus/Close Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute top-6 right-6 w-6 h-6 rounded-4xl flex items-center justify-center bg-white/10 text-white/60 hover:text-white/80 transition-colors z-3"
            >
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={12} strokeWidth={3} color="white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PlusIcon size={12} strokeWidth={3} color="white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Title */}
            <p className="text-white/80 text-sm leading-relaxed mb-auto p-4 pr-12">
              {title}
            </p>

            {/* Percentage Display */}
            <div className="flex items-baseline gap-1">
              <span className="text-white text-7xl font-medium leading-none">
                <RollingNumber value={percentage} duration={1} />
              </span>
              <span className="text-white text-4xl font-bold leading-none mb-2">
                {unit}
              </span>
            </div>

            {/* Suffix */}
            {suffix && <p className="text-white/60 text-sm mt-2">{suffix}</p>}

            {/* Disclosure Overlay */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 rounded-4xl bg-white/10 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center overflow-hidden z-2"
                >
                  <div className="max-w-full overflow-y-auto max-h-full">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2,
                        ease: "easeOut",
                      }}
                      className="text-[#fda6228c] text-sm leading-relaxed"
                    >
                      {disclosure?.split("").map((char, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.02,
                            delay: 0.1 + index * 0.005,
                            ease: "easeOut",
                          }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkWithUs;

const Digit = ({ value, duration }: { value: number; duration: number }) => {
  return (
    <div className="relative h-[1em] overflow-hidden inline-block">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: `-${value * 10}%` }}
        transition={{
          duration: duration,
          ease: [0.15, 0.05, 0.75, 1], // Smooth cubic-bezier
        }}
        className="flex flex-col"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="flex items-center justify-center">
            {n}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const RollingNumber = ({
  value,
  duration = 0.5,
}: {
  value: string;
  duration?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (!isInView)
    return (
      <span ref={ref} className="opacity-0">
        {value}
      </span>
    );

  return (
    <span ref={ref} className="inline-flex items-baseline">
      {value.split("").map((char, index) => {
        // If it's a number, animate it
        if (!isNaN(parseInt(char))) {
          return (
            <Digit key={index} value={parseInt(char)} duration={duration} />
          );
        }
        // If it's a dot or comma, just show it
        return (
          <span key={index} className="relative">
            {char}
          </span>
        );
      })}
    </span>
  );
};
