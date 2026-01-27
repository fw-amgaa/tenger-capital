"use client";

import { useComponentWidth } from "@/hooks/use-component-width";
import { cn } from "@/lib/utils";
import {
  motion,
  useAnimation,
  useInView,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import GradientBorderButton from "../gradient-border-button";
import Link from "next/link";

const openingState = 0.22;
const firstState = 0.3;
const secondState = 0.6;
const thirdState = 0.65;
const fourthState = 0.71;
const fifthState = 0.75;
const closingState = 0.8;

const initialBorderRadius = "32px";
const initialMargin = "64px";

const months = [
  {
    month: "JAN",
    hours: "0AM",
  },
  {
    month: "FEB",
    hours: "4AM",
  },
  {
    month: "MAR",
    hours: "8AM",
  },
  {
    month: "APR",
    hours: "12AM",
  },
  {
    month: "MAY",
    hours: "4PM",
  },
  {
    month: "JUN",
    hours: "8PM",
  },
  {
    month: "JUL",
    hours: "12PM",
  },
  {
    month: "AUG",
    hours: "0AM",
  },
  {
    month: "SEP",
    hours: "0AM",
  },
  {
    month: "OCT",
    hours: "0AM",
  },
  {
    month: "NOV",
    hours: "0AM",
  },
  {
    month: "DEC",
    hours: "0AM",
  },
];

interface Props {
  setHeaderMode: Dispatch<SetStateAction<"light" | "dark">>;
}

export default function Offerings({ setHeaderMode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, width } = useComponentWidth();
  const [isOverflowHidden, setIsOverflowHidden] = useState(true);
  const [showMonth, setShowMonth] = useState(false);

  const controls = useAnimation();
  const endControls = useAnimation();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const borderRadius = useTransform(
    scrollYProgress,
    [0, openingState, closingState, 1],
    [initialBorderRadius, "0px", "0px", initialBorderRadius]
  );
  const margin = useTransform(
    scrollYProgress,
    [0, openingState, closingState, 1],
    [initialMargin, "0px", "0px", initialBorderRadius]
  );

  const dayWidth = useTransform(
    scrollYProgress,
    [firstState, secondState],
    ["100%", "10%"]
  );
  const yearWidth = useTransform(
    scrollYProgress,
    [firstState, secondState],
    ["0%", "90%"]
  );

  const monthWidth = useTransform(
    scrollYProgress,
    [firstState, secondState],
    [width / 7, width / 12]
  );
  const graphOpacity = useTransform(
    scrollYProgress,
    [firstState, secondState],
    [0.1, 1]
  );
  const graphScale = useTransform(
    scrollYProgress,
    [firstState, secondState],
    [2, 1]
  );

  const strokeWidth = useTransform(
    scrollYProgress,
    [firstState, secondState],
    [0.5, 1]
  );
  const translate3d = useTransform(
    scrollYProgress,
    [firstState, secondState],
    [2.5, 15]
  );

  const clipPath = useTransform(
    scrollYProgress,
    [firstState, thirdState],
    ["49%", "-1%"]
  );
  const containerScale = useTransform(
    scrollYProgress,
    [thirdState, fifthState],
    [1, 2]
  );
  const containerTranslateY = useTransform(
    scrollYProgress,
    [thirdState, fifthState],
    ["0%", "-60%"]
  );
  const thirdStateOpacity = useTransform(
    scrollYProgress,
    [thirdState, thirdState + 0.02],
    [1, 0]
  );

  const clipPathValue = useMotionTemplate`inset(0px ${clipPath} 0px 0px)`;
  const translateY = useMotionTemplate`translate3d(0px, calc(-100% + ${translate3d}vh), 0px)`;
  const thirdStateBorderColor = useMotionTemplate`rgba(219, 219, 219, ${thirdStateOpacity})`;

  // clip-path: inset(0px 49% 0px 0px); stroke-width: 0.5px; transform: translate3d(0px, calc(-100% + 2.5vh), 0px);
  // clip-path: inset(0px -1% 0px 0px); stroke-width: 1px; transform: translate3d(0px, calc(-100% + 15vh), 0px);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > firstState) {
      setShowMonth(true);
      controls.start({ opacity: 0, transition: { duration: 0.3 } });
    } else {
      setShowMonth(false);
      controls.start({ opacity: 1, transition: { duration: 0.3 } });
    }

    if (v > thirdState) {
      setIsOverflowHidden(false); // remove overflow-hidden
    } else {
      setIsOverflowHidden(true); // apply overflow-hidden
    }

    if (v > fourthState) {
      endControls.start({ opacity: 1 });
    } else {
      endControls.start({ opacity: 0 });
    }

    if (v >= 0.99) {
      setHeaderMode("dark");
    } else if (v > 0.22) {
      setHeaderMode("light");
    } else {
      setHeaderMode("dark");
    }
  });

  return (
    <motion.div
      ref={containerRef}
      style={{
        paddingLeft: margin,
        paddingRight: margin,
      }}
      className="relative mb-8 md:mb-16"
    >
      <motion.div
        style={{ borderRadius }}
        className="sticky top-0 bg-white w-full h-screen flex items-center justify center"
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* Graph */}
          <div className="absolute inset-0 h-full w-full p-16">
            <div className="relative w-full h-full">
              <div className="absolute inset-0">
                <div
                  ref={ref}
                  className={cn(
                    isOverflowHidden ? "overflow-hidden" : "",
                    "absolute bottom-[7rem] left-[.5rem] flex h-[75%] w-[calc(100%-1rem)] flex-col gap-[1.3rem] lg:top-[6rem] lg:left-[6rem] lg:h-[calc(100%-6rem)] lg:w-[calc(100%-12rem)]"
                  )}
                >
                  <motion.div
                    style={{
                      scale: containerScale,
                      y: containerTranslateY,
                      borderColor: thirdStateBorderColor,
                    }}
                    className="h-full w-full border-[1px] overflow-hidden"
                  >
                    <div className="relative flex h-[100%] w-[150%] lg:w-[100%] origin-[50%,80%] overflow-hidden">
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          opacity: graphOpacity,
                          transformOrigin: "left center",
                          scale: graphScale,
                        }}
                      >
                        <motion.div
                          style={{
                            clipPath: clipPathValue,
                            strokeWidth,
                            transform: translateY,
                          }}
                          className="absolute top-[70%] left-0 h-[auto] w-[100%]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 1212 496"
                            className="h-[100%] w-[100%]"
                          >
                            <path
                              stroke="#0A0A0A"
                              d="M 0.418 470.981 L 10.352 466.019 C 10.757 465.815 11.248 465.901 11.561 466.23 L 17.136 472.061 C 17.624 472.572 18.47 472.453 18.798 471.827 L 24.251 461.423 C 24.286 461.356 24.328 461.294 24.377 461.235 L 29.961 454.625 C 30.265 454.265 30.773 454.157 31.198 454.361 L 38.121 457.69 C 38.17 457.714 38.22 457.734 38.271 457.749 L 43.23 459.243 C 43.39 459.291 43.536 459.377 43.655 459.494 L 48.965 464.701 C 49.46 465.187 50.285 465.055 50.605 464.439 L 53.285 459.278 C 53.647 458.58 54.624 458.526 55.061 459.18 L 59.225 465.418 C 59.338 465.588 59.399 465.788 59.399 465.992 L 59.399 477.456 C 59.399 477.724 59.502 477.981 59.689 478.174 L 67.037 485.795 C 67.085 485.845 67.128 485.899 67.165 485.958 L 72.221 493.913 C 72.634 494.563 73.588 494.549 73.981 493.888 L 78.121 486.934 C 78.658 486.032 80.041 486.413 80.041 487.463 L 80.041 490.095 C 80.041 490.666 80.505 491.129 81.075 491.129 L 91.48 491.129 C 91.712 491.129 91.937 491.051 92.12 490.908 L 101.275 483.706 L 109.135 478.848 C 109.812 478.43 110.688 478.902 110.712 479.698 C 110.712 479.707 110.712 479.717 110.712 479.727 L 110.712 485.967 C 110.712 487.097 112.264 487.407 112.699 486.365 L 119.778 469.396 C 120.117 468.583 121.329 468.826 121.329 469.707 C 121.329 470.299 121.945 470.689 122.48 470.436 L 132.535 465.679 L 144.022 460.046 C 144.709 459.709 145.511 460.209 145.511 460.974 L 145.511 464.645 C 145.511 465.216 145.973 465.679 146.544 465.679 L 150.163 465.679 C 150.564 465.679 150.928 465.91 151.098 466.272 L 155.388 475.376 C 155.558 475.738 155.922 475.969 156.322 475.969 L 163.432 475.969 C 163.958 475.969 164.385 476.395 164.385 476.921 C 164.385 477.447 164.811 477.874 165.337 477.874 L 176.341 477.874 C 176.616 477.874 176.88 477.764 177.074 477.569 L 183.329 471.285 C 183.523 471.09 183.787 470.981 184.062 470.981 L 187.153 470.981 C 187.528 470.981 187.874 470.777 188.056 470.45 L 193.721 460.265 C 194.007 459.747 194.669 459.576 195.17 459.89 L 200.793 463.389 C 201.364 463.744 202.116 463.469 202.323 462.829 L 206.051 451.286 C 206.261 450.634 207.225 450.785 207.225 451.471 C 207.225 451.913 207.685 452.204 208.085 452.014 L 216.326 448.092 C 216.838 447.848 217.451 448.062 217.7 448.572 L 228.41 470.579 C 228.83 471.443 230.099 471.316 230.339 470.386 L 234.12 455.763 C 234.319 454.993 235.277 454.728 235.844 455.285 C 235.846 455.287 235.848 455.289 235.85 455.291 L 239.326 458.763 C 239.654 459.09 240.159 459.159 240.563 458.933 L 249.062 454.157 C 249.229 454.063 249.366 453.925 249.459 453.758 L 258.216 438.014 C 258.507 437.491 259.18 437.324 259.682 437.65 L 268.525 443.391 C 268.995 443.696 269.623 443.57 269.94 443.108 L 273.781 437.497 C 273.974 437.215 274.293 437.047 274.634 437.047 L 282.493 437.047 C 283.063 437.047 283.526 436.584 283.526 436.014 L 283.526 433.911 C 283.526 433.152 284.318 432.652 285.004 432.978 L 292.659 436.622 C 293.159 436.859 293.757 436.661 294.016 436.172 L 298.995 441.897 L 303.363 448.911 C 303.554 448.62 305.497 444.805 305.845 444.805 L 307.942 444.876 C 308.317 444.876 309.287 443.225 309.469 442.898 L 311.276 444.439 C 311.458 444.111 314.369 450.955 314.744 450.955 L 318.799 454.861 C 319.37 454.861 322.933 448.825 322.933 448.255 L 327.597 440.601 C 327.597 440.03 330.957 443.86 331.528 443.86 L 334.48 443.115 C 334.784 443.115 338.197 446.903 338.394 446.671 L 345.97 459.433 C 346.166 459.202 354.058 437.215 354.362 437.215 L 355.68 436.079 C 356.572 434.845 359.411 432.03 359.574 431.649 L 362.978 436.206 C 363.256 435.556 364.974 433.84 365.501 434.313 L 368.401 429.891 C 368.59 430.062 371.574 432.904 371.829 432.904 L 386.621 442.267 C 386.704 442.267 387.78 440.342 387.861 440.362 C 389.287 440.711 392.869 448.546 396.652 449.695 C 396.877 449.764 403.467 448.717 404.254 448.799 L 408.933 454.299"
                            />
                            <path
                              stroke="#0A0A0A"
                              d="M 408.475 453.385 L 409.711 455.906 C 410.326 456.849 410.459 457.463 410.773 457.792 L 411.668 457.581 C 412.089 458.021 416.111 451.58 417.415 444.764"
                            />
                            <path
                              stroke="#0A0A0A"
                              d="M 417.435 444.793 C 417.646 443.691 417.787 443.012 417.833 442.925 L 420.842 438.802 C 420.877 438.735 424.977 441.464 425.026 441.407 L 428.889 436.017 C 429.193 435.657 433.012 445.996 433.437 446.2 L 437.195 428.789 C 437.244 428.812 437.294 428.831 437.345 428.847 L 438.671 429.423 C 438.832 429.471 443.591 438.239 443.711 438.356 L 447.358 435.913 C 447.835 435.956 448.485 434.521 449.646 435.702 L 451.528 438.21 C 451.891 437.512 453.604 435.235 454.041 435.889 L 455.028 440.832 C 455.141 441.002 456.94 443.431 456.94 443.635 L 458.516 448.555 C 458.516 448.822 458.619 449.079 458.806 449.272 L 464.919 454.308 C 464.967 454.359 466.522 451.401 466.284 450.945 L 466.904 441.707"
                            />
                            <path
                              stroke="#0A0A0A"
                              d="M 466.797 441.368 L 471.28 448.407 C 471.695 449.057 472.65 449.043 473.045 448.382 L 477.192 441.428 C 477.73 440.526 479.117 440.907 479.117 441.957 L 479.117 444.59 C 479.117 445.16 479.581 445.623 480.152 445.623 L 490.578 445.623 C 490.811 445.623 491.036 445.545 491.218 445.402 L 500.393 438.2 L 508.269 433.342 C 508.947 432.924 509.825 433.396 509.849 434.192 C 509.849 434.201 509.849 434.211 509.849 434.221 L 509.849 440.461 C 509.849 441.591 511.404 441.902 511.84 440.859 L 518.933 423.891 C 519.273 423.077 520.487 423.32 520.487 424.201 C 520.487 424.793 521.105 425.183 521.641 424.93 L 531.716 420.173 L 543.226 414.54 C 543.915 414.203 544.718 414.703 544.718 415.468 L 544.718 419.139 C 544.718 419.71 545.182 420.173 545.753 420.173 L 549.381 420.173 C 549.782 420.173 550.146 420.404 550.317 420.766 L 554.615 429.87 C 554.786 430.232 555.15 430.463 555.552 430.463 L 562.676 430.463 C 563.203 430.463 563.631 430.89 563.631 431.416 C 563.631 431.941 564.057 432.368 564.584 432.368 L 575.611 432.368 C 575.886 432.368 576.151 432.258 576.345 432.063 L 582.613 425.779 C 582.807 425.584 583.072 425.475 583.347 425.475 L 586.445 425.475 C 586.82 425.475 587.167 425.272 587.349 424.944 L 593.026 414.759 C 593.313 414.243 593.976 414.072 594.478 414.384 L 600.112 417.883 C 600.684 418.238 601.438 417.963 601.645 417.323 L 605.381 405.78 C 605.592 405.128 606.557 405.279 606.557 405.965 C 606.557 406.407 607.019 406.698 607.419 406.508 L 615.677 402.586 C 616.19 402.342 616.805 402.557 617.053 403.067 L 627.785 425.073 C 628.206 425.937 629.477 425.81 629.719 424.88 L 633.507 410.258 C 633.707 409.487 634.667 409.222 635.236 409.78 C 635.238 409.782 635.239 409.783 635.241 409.785 L 638.723 413.257 C 639.052 413.584 639.558 413.654 639.963 413.427 L 648.479 408.651 C 648.646 408.558 648.783 408.42 648.877 408.253 L 657.651 392.508 C 657.943 391.985 658.617 391.818 659.12 392.144 L 667.981 397.885 C 668.452 398.19 669.082 398.065 669.399 397.602 L 673.248 391.991 C 673.441 391.709 673.761 391.541 674.103 391.541 L 681.977 391.541 C 682.55 391.541 683.013 391.078 683.013 390.508 L 683.013 388.406 C 683.013 387.646 683.806 387.146 684.494 387.472 L 692.164 391.116 C 692.665 391.354 693.264 391.155 693.524 390.666 L 698.97 380.407 L 706.346 369.208 C 706.538 368.917 706.863 368.742 707.211 368.742 L 713.727 368.742 C 714.102 368.742 714.449 368.539 714.631 368.211 L 721.723 355.487 C 721.906 355.16 722.252 354.956 722.628 354.956 L 729.848 354.956 C 730.42 354.956 730.884 354.494 730.884 353.923 L 730.884 347.506 C 730.884 346.936 731.347 346.473 731.919 346.473 L 741.043 346.473 C 741.346 346.473 741.636 346.339 741.832 346.108 L 750.668 335.704 C 750.865 335.472 751.153 335.338 751.458 335.338 L 757.978 335.338 C 758.393 335.338 758.766 335.092 758.93 334.712 L 764.002 322.88 C 764.282 322.229 765.118 322.045 765.646 322.518 L 768.413 324.999 C 768.603 325.17 768.85 325.264 769.105 325.264 L 775.084 325.264 C 775.168 325.264 775.238 325.271 775.319 325.291 C 776.748 325.64 791.756 329.31 795.547 330.458 C 795.772 330.526 795.965 330.674 796.094 330.87 L 803.788 341.874"
                            />
                            <path
                              stroke="#0A0A0A"
                              d="M 807.159 145.053 L 808.234 144.517"
                            />
                            <path
                              stroke="#0A0A0A"
                              d="M 803.457 342.267 L 811.383 334.123 C 811.789 333.919 812.281 334.005 812.594 334.334 L 818.18 340.165 C 818.67 340.676 819.516 340.557 819.846 339.931 L 825.309 329.527 C 825.344 329.46 825.386 329.398 825.435 329.339 L 831.031 322.729 C 831.335 322.369 831.845 322.26 832.271 322.465 L 839.208 325.795 C 839.256 325.818 839.307 325.838 839.358 325.853 L 844.328 327.346 C 844.488 327.395 844.634 327.481 844.753 327.598 L 850.073 332.804 C 850.57 333.29 851.396 333.159 851.717 332.543 L 854.402 327.382 C 854.766 326.684 855.745 326.631 856.182 327.284 L 859.191 332.972 C 859.305 333.142 860.024 333.976 860.082 333.813 L 861.179 316.119 C 860.988 316.324 862.17 314.46 862.357 314.653 L 863.529 316.059"
                            />
                            <path
                              stroke="#0A0A0A"
                              d="M 863.354 315.822 L 867.056 324.449 C 867.104 324.499 868.197 322.975 868.234 323.034 L 873.3 330.989 C 873.714 331.639 874.669 331.625 875.064 330.963 L 879.211 324.01 C 879.749 323.108 881.137 323.489 881.137 324.539 L 881.137 327.171 C 881.137 327.742 881.6 328.205 882.172 328.205 L 892.598 328.205 C 892.831 328.205 893.056 328.127 893.238 327.984 L 902.413 320.782 L 910.289 315.924 C 910.967 315.506 911.845 315.978 911.869 316.774 C 911.869 316.783 911.869 316.793 911.869 316.803 L 911.869 323.043 C 911.869 324.172 913.424 324.483 913.86 323.441 L 920.952 306.472 C 921.293 305.659 922.506 305.901 922.506 306.783 C 922.506 307.375 923.125 307.765 923.661 307.512 L 933.736 302.755 L 945.246 297.122 C 945.935 296.785 946.737 297.285 946.737 298.05 L 946.737 301.721 C 946.737 302.291 947.201 302.755 947.773 302.755 L 951.4 302.755 C 951.801 302.755 952.165 302.985 952.337 303.347 L 956.634 312.452 C 956.806 312.814 957.17 313.045 957.571 313.045 L 964.696 313.045 C 965.223 313.045 965.65 313.471 965.65 313.997 C 965.65 314.523 966.077 314.949 966.604 314.949 L 977.631 314.949 C 977.906 314.949 978.17 314.84 978.364 314.645 L 984.633 308.361 C 984.827 308.166 985.091 308.057 985.366 308.057 L 988.465 308.057 C 988.84 308.057 989.187 307.853 989.369 307.526 L 995.042 297.341 C 995.332 296.824 995.992 296.653 996.492 296.965 L 1002.13 300.465 C 1002.7 300.82 1003.45 300.545 1003.67 299.905 L 1007.39 288.362 C 1007.61 287.71 1008.57 287.862 1008.57 288.547 C 1008.57 288.989 1009.04 289.28 1009.44 289.09 L 1017.461 285.119 C 1017.981 284.876 1018.879 286.834 1019.07 285.648 L 1035.71 207.024 C 1036.137 205.696 1038.192 206.346 1038.612 206.276"
                            />
                            <path
                              stroke="#0A0A0A"
                              d="M 1038.514 206.45 L 1042.02 192.845 C 1042.22 192.072 1043.19 191.808 1043.75 192.373 L 1047.24 195.845 C 1047.57 196.172 1048.07 196.241 1048.48 196.015 L 1057 191.239 C 1057.16 191.145 1057.3 191.007 1057.39 190.84 L 1066.17 175.096 C 1066.46 174.573 1067.13 174.406 1067.64 174.731 L 1076.5 180.473 C 1076.97 180.778 1077.6 180.653 1077.91 180.189 L 1081.76 174.579 C 1081.96 174.297 1082.28 174.129 1082.62 174.129 L 1090.5 174.129 C 1091.07 174.129 1091.53 173.666 1091.53 173.095 L 1091.53 170.993 C 1091.53 170.233 1092.32 169.733 1093.01 170.06 L 1100.68 173.703 C 1101.18 173.941 1101.78 173.743 1102.04 173.254 L 1107.48 162.994 L 1114.87 151.795 C 1115.06 151.505 1115.38 151.33 1115.73 151.33 L 1122.24 151.33 C 1122.62 151.33 1122.96 151.126 1123.15 150.799 L 1130.24 138.075 C 1130.42 137.747 1130.77 137.544 1131.14 137.544 L 1135.688 139.202 C 1136.258 139.202 1137.797 138.099 1137.797 137.529 L 1139.4 130.094 C 1139.4 129.524 1139.87 129.061 1140.44 129.061 L 1145.351 131.944 C 1147.971 133.116 1149.349 128.891 1149.419 128.875"
                            />
                            <path
                              stroke="#0A0A0A"
                              d="M 1149.338 129.057 C 1150.164 129.897 1159.393 70.613 1159.542 70.44 L 1160.304 69.527 C 1160.752 70.062 1163.108 73.088 1163.418 72.411 L 1165.8 54.916 C 1166.147 52.251 1167.947 56.577 1168.238 56.654 L 1170.375 55.074 C 1172.038 54.593 1173.384 58.273 1173.852 52.652 C 1173.756 52.771 1174.042 50.978 1177.097 49.095 C 1177.287 49.265 1178.293 44.962 1178.553 44.962 L 1182.394 46.278 C 1182.484 46.278 1183.561 44.333 1183.62 44.39 C 1184.854 45.575 1188.404 49.526 1190.296 47.597 C 1190.457 47.433 1200.826 30.055 1201.736 28.508 L 1211.846 0.389"
                            />
                          </svg>
                        </motion.div>
                      </motion.div>

                      {months.map((month) => (
                        <motion.div
                          key={month.month}
                          style={{
                            borderColor: thirdStateBorderColor,
                            width: monthWidth,
                          }}
                          className="flex shrink-0 items-end p-[1rem] border-r-[1px]"
                        >
                          <motion.span
                            style={{ opacity: thirdStateOpacity }}
                            className="text-black/10 font-semibold text-xs"
                          >
                            {showMonth ? month.month : month.hours}
                          </motion.span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    style={{ opacity: thirdStateOpacity }}
                    className="flex"
                  >
                    <motion.div
                      className="flex flex-col gap-[.6rem]"
                      style={{ width: dayWidth }}
                    >
                      <div className="h-1.5 w-[100%] rounded-full bg-black/10" />
                      <p className="text-black opacity-10 font-semibold text-xs">
                        A DAY
                      </p>
                    </motion.div>
                    <motion.div className="flex" style={{ width: yearWidth }}>
                      <div className="w-4" />
                      <div className="flex flex-col gap-[.6rem] w-full">
                        <div className="h-1.5 w-[100%] rounded-full bg-black" />
                        <p className="text-black font-semibold text-xs whitespace-nowrap">
                          A YEAR
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              <div className="relative z-2 flex h-full w-full md:items-center md:justify-center">
                <motion.h2
                  className="text-xl md:text-7xl text-black md:text-center"
                  animate={controls}
                >
                  <div>Markets move daily.</div>
                  <div>Your focus shouldn&apos;t.</div>
                </motion.h2>
                <div className="absolute bottom-[3.5rem] flex w-full flex-col items-center gap-[3.5rem] lg:w-[50%] lg:min-w-[51.8rem]">
                  <motion.div className="flex flex-col relative text-center text-black">
                    <div className="flex flex-col mb-8 text-2xl md:text-4xl">
                      <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ ...endControls, animationDelay: 0 }}
                      >
                        We filter out the noise,&nbsp;
                      </motion.h3>
                      <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ ...endControls, animationDelay: 0.1 }}
                      >
                        so you don&apos;t have to.&nbsp;
                      </motion.h3>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ ...endControls, animationDelay: 0.2 }}
                    >
                      <Link href="/offerings">
                        <GradientBorderButton
                          borderAnimation={false}
                          mode={"light"}
                        >
                          Offerings
                        </GradientBorderButton>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <motion.div
            animate={controls}
            className="flex-center absolute right-0 bottom-[2.4rem] left-0 md:bottom-[4.5rem]"
          >
            <div className="text-[8px] text-[#364153] text-center opacity-[.3] leading-6">
              For illustrative purposes only; not representative of actual
              clients.{" "}
              <a
                className="underline underline-offset-[.2rem] font-semibold"
                href="https://web.archive.org/web/20251007172158mp_/https://titan.com"
                target="_blank"
                rel="noopener"
              >
                Growth is not guaranteed
              </a>
              .
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="h-500" />
    </motion.div>
  );
}
