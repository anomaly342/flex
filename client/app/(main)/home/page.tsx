"use client";
import Image from "next/image";
import Link from "next/link";
import "./home.css";

export default function Home() {
    let role = "Membership";
    let points = 999;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("Button clicked!", event);
    };

    return (
        <div className="maindiv">
            <main className="min-[431px]:flex min-[431px]:flex-row min-[431px]:justify-center ">
                <div className="flex flex-col min-[431px]:justify-center">
                    <Link
                        href="/group"
                        className="border m-3 p-3 text-center flex justify-center items-center min-[431px]:w-100 min-[431px]:h-40 min-[431px]:text-xl "
                    >
                        Group
                    </Link>
                    <Link
                        href="/individual"
                        className="border m-3 p-3 text-center flex items-center justify-center min-[431px]:w-100 min-[431px]:h-40 min-[431px]:text-xl"
                    >
                        Individual
                    </Link>
                </div>
                <div className="border-2 m-5 min-[431px]:max-w-140">
                    <div className="block p-3">
                        <h1>Welcome,</h1>
                        <div className="flex flex-row space-x-5 justify-start mt-3">
                            <Image
                                src="/profile.svg"
                                alt="User Profile"
                                width={50}
                                height={50}
                            />
                            <div className="flex flex-col">
                                <h3>Username</h3>
                                <h4>
                                    <span className="rolename">{role}</span>{" "}
                                    Points: {points}
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="block pb-3 pl-3 pr-3">
                        <h1>Today</h1>
                        <div className="border flex flex-row justify-start p-3 space-x-5">
                            <div className="text-center">
                                <p>08:00</p>
                                <p>to</p>
                                <p>12:00</p>
                            </div>
                            <div className="text-start flex flex-col justify-center">
                                <p>Room 1</p>
                                <p>(Room 1 Details)</p>
                            </div>
                        </div>
                    </div>
                    <div className="block pb-3 pl-3 pr-3">
                        <h1>Friday</h1>
                        <div className="border flex flex-row justify-start p-3 space-x-5">
                            <div className="text-center">
                                <p>13:00</p>
                                <p>to</p>
                                <p>16:00</p>
                            </div>
                            <div className="text-start flex flex-col justify-center">
                                <p>Room 5</p>
                                <p>(Room 5 Details)</p>
                            </div>
                        </div>
                    </div>
                    <div className="block pb-3 pl-3 pr-3">
                        <h1>Sunday</h1>
                        <div className="border flex flex-row justify-start p-3 space-x-5">
                            <div className="text-center">
                                <p>09:00</p>
                                <p>to</p>
                                <p>12:00</p>
                            </div>
                            <div className="text-start flex flex-col justify-center">
                                <p>Room 8</p>
                                <p>(Room 8 Details)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
