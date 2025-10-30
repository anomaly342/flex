"use client";
import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./success.css";

export default function PaySuccessful() {
    const price = 500;
    const date = "15 Jan 2025";
    const time = "12:34";
    return (
        <div className="maindiv">
            <Image
                src="/check.svg"
                width={100}
                height={100}
                alt="Payment Success"
            />
            <p className="head-text">Payment Successful</p>
            <div className="amount-section">
                <span>Amount:</span>
                <span>{price} ฿</span>
            </div>

            <div className="date-section">
                <span>Date & Time:</span>
                <div className="date-text">
                    <p>{date}</p>
                    <p>{time}</p>
                </div>
            </div>
            <Link href="/order-detail" className="detail-link">
                View Order
            </Link>
        </div>
    );
}
