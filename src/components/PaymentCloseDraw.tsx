"use client";
import React, { useState } from "react";
import useMeasure from "react-use-measure";
import {
  useDragControls,
  useMotionValue,
  useAnimate,
  motion,
} from "framer-motion";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { userStorage } from "@/store/link";
// import { useRouter } from "next/router";

interface DragCloseDrawerInterface {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export const DragCloseDrawerExample = () => {
  const user = userStorage(state => state.user);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [isLoaded, setIsLoaded] = useState(false);

  const { data: session, status } = useSession();

  const handleButtonClick = () => {
    if (status === "unauthenticated") {
      toast.error("Login is required", {
        duration: 4000,
        style: { color: "red" },
      });
      return;
    }

    console.log(user);

    console.log(user.userType);
    if(user.userType === "PREMIUM") {
      toast.error("You are already a premium user", {
        duration: 4000,
        style: { color: "red" },
      });
      return;
    }
    setOpen(true);
  };

  const updateUserDetails = async (payerName: string) => {
    try {
      if (!session?.user?.id) return;

      const response = await axios.patch(`/api/user/${session.user.id}`, {
        userType: "PREMIUM",
        credits: 1000,
      });

      if (response.status === 200) {
        toast.success(`Purchase Completed Successfully ${payerName}`);
        router.push("/x");
      } else {
        toast.error("Error updating user");
      }
    } catch (error) {
      console.log("Error updating user:", error);
      toast.error("Error updating user");
    }
  };

  return (
    <div className="grid place-content-center ">
      <button
        onClick={handleButtonClick}
        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 hover:scale-105 hover:font-medium duration-75 transition-all"
      >
        Get Started with Pro
      </button>

      <DragCloseDrawer open={open} setOpen={setOpen}>
        <PayPalScriptProvider
          options={{
            clientId:
              "AS69o9fqd9SPsxWtOVG_f5uIi_62h8VUHk98az5HnT2NS_kiPCQnoH2cf4X2oHC6ViVVTbwpR9xgUUoi",
          }}
        >
          <div className="flex flex-col mx-auto items-center justify-center w-2/3">
            <h2 className="text-4xl font-bold text-neutral-200 mb-4">
              Complete your purchase
            </h2>
            <p className="text-gray-400">
              Select your preferred payment method to access premium features
            </p>

            <div className="flex w-full items-center justify-center gap-10 m-10">
              <div className="flex w-full flex-col p-10 rounded-lg bg-zinc-800 text-gray-200">
                <p className="text-xl font-semibold">Pro Membership Benefits</p>
                <div className="p-4 flex flex-col gap-2 rounded-lg ">
                  <p className="text-base flex gap-2 items-center justify-start text-body-color dark:text-dark-6">
                    <FaCheckCircle color="green" />
                    1,000 new links/mo
                  </p>
                  <p className="text-base flex gap-2 items-center justify-start text-body-color dark:text-dark-66">
                    <FaCheckCircle color="green" />
                    50K tracked clicks/mo
                  </p>
                  <p className="text-base flex gap-2 items-center justify-start text-body-color dark:text-dark-6">
                    <FaCheckCircle color="green" />
                    1-year analytics retention
                  </p>
                  <p className="text-base flex gap-2 items-center justify-start text-body-color dark:text-dark-6">
                    <FaCheckCircle color="green" />
                    10 custom domains
                  </p>
                  <p className="text-base flex gap-2 items-center justify-start text-body-color dark:text-dark-6">
                    <FaCheckCircle color="green" />
                    Priority support
                  </p>
                </div>
              </div>

              <div className="border w-full rounded-lg py-10 h-full">
                <div className="m-4">
                  <PayPalButtons
                    className=""
                    style={{
                      layout: "vertical", // Layout can be 'vertical' or 'horizontal'
                      label: "paypal", // Ensure it shows PayPal button only
                    }}
                    fundingSource="paypal"
                    createOrder={(data, actions) => {
                      if (!actions.order)
                        return Promise.reject("Order creation failed");
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: "5.00",
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (!actions?.order)
                        return Promise.reject("Order capture failed");
                      // return actions.order.capture().then((details) => {
                      //   const payerName =
                      //     details?.payer?.name?.given_name || "Customer";
                      //   toast.success(`Transaction completed by ${payerName}`, {
                      //     duration: 5000,
                      //     style: {
                      //       color: "green",
                      //     },
                      //   });
                      //   // alert(`Transaction completed by ${payerName}`);
                      //   console.log("Data: ", data);
                      //   console.log("Details: ", details);
                      //   setOpen(false);
                      const details = await actions.order.capture();
                      const payerName =
                        details?.payer?.name?.given_name || "Customer";

                      await updateUserDetails(payerName);

                      // toast.success(`Transaction completed by ${payerName}`, {
                      //   duration: 5000,
                      //   style: {
                      //     color: "green",
                      //   },
                      // });
                    }}
                  />
                  <p className="text-gray-500 line-through text-sm">
                    $9.99/month
                  </p>
                  <p className="text-gray-200 font-medium text-lg">
                    $4.99/month
                  </p>
                  <p className="text-green-600 text-sm">
                    67% discount for users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PayPalScriptProvider>
      </DragCloseDrawer>
    </div>
  );
};

const DragCloseDrawer = ({
  open,
  setOpen,
  children,
}: DragCloseDrawerInterface) => {
  const [scope, animate] = useAnimate();
  const [drawerRef, { height }] = useMeasure();
  const y = useMotionValue(0);
  const controls = useDragControls();

  const handleClose = async () => {
    animate(scope.current, { opacity: [1, 0] });
    const yStart = typeof y.get() === "number" ? y.get() : 0;
    await animate("#drawer", { y: [yStart, height] });
    setOpen(false);
  };

  return (
    <>
      {open && (
        <motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-neutral-950/70"
        >
          <motion.div
            id="drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ ease: "easeInOut" }}
            className="absolute bottom-0 h-[75vh] w-full overflow-hidden rounded-t-3xl bg-neutral-900"
            style={{ y }}
            drag="y"
            dragControls={controls}
            onDragEnd={() => {
              if (y.get() >= 100) handleClose();
            }}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
          >
            <div className="absolute left-0 right-0 top-0 z-10 flex justify-center bg-neutral-900 p-4">
              <button
                onPointerDown={(e) => controls.start(e)}
                className="h-2 w-14 cursor-grab touch-none rounded-full bg-neutral-700 active:cursor-grabbing"
              ></button>
            </div>
            <div className="relative z-0 h-full overflow-y-scroll p-4 pt-12">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
