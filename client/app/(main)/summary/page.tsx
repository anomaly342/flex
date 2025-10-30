"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./summary.css";

export default function OrderSummary() {
    const theme = "Japanese";
    const location = "Floor 3, room 4";
    const startTime = "9.00";
    const endTime = "15.00";
    const hours = 6;
    const rate = 50; // ฿/hr
    const basePrice = hours * rate; // 300
    // const holidayDiscountLabel = "-15% สงกรานต์";
    const [holidayDiscountLabel, setholidayDiscountLabel] = useState<
        string | null
    >(null);
    const holidayDiscount = 45;
    const pointReduction = 3;
    const role = "Membership";
    const [points, setPoints] = useState(999);
    const [pointsRedeem, setPointsRedeem] = useState(0);

    const addPointsRedeem = (num: number) => {
        if (points <= 0) return;

        setPoints(points - num);
        setPointsRedeem(pointsRedeem + num);
    };

    const reductPointsRedeem = (num: number) => {
        if (pointsRedeem <= 0) return;

        setPoints(points + num);
        setPointsRedeem(pointsRedeem - num);
    };

    let coupons = [
        "-15% ปีใหม่",
        "-15% สงกรานต์ (ลดสูงสุด 100 บาท)",
        "-10% ช่วงสอบ (ลดสูงสุด 100 บาท)",
    ];

    const total = basePrice - holidayDiscount - pointReduction;

    const [showModal, setShowModal] = useState(false);
    const [selectedCoupons, setSelectedCoupons] = useState<string | null>(null);

    return (
        <div className="maindiv">
            {/* เนื้อหา */}
            <div className="content">
                {/* Title */}
                <p className="title-text">Order Summary</p>

                {/* แถว Theme / Location */}
                <div className="detail-section">
                    <div className="detail-div">
                        <p className="detail-text">Theme</p>
                        <p>{theme}</p>
                    </div>
                    <div className="detail-div">
                        <p className="detail-text">Location</p>
                        <p>{location}</p>
                    </div>
                </div>

                {/* Duration */}
                <div className="duration-section">
                    <p className="detail-text">Duration</p>
                    <div className="duration-div">
                        {/* ซ้าย: เวลา 9.00-15.00 = */}
                        <div className="detail-div">
                            <p>
                                {startTime}-{endTime} =
                            </p>
                        </div>

                        {/* ขวา: คำนวณราคา */}
                        <div className="detail-div">
                            {/* ชั่วโมง */}
                            <div className="hour-div">
                                <span className="time-text">{hours}</span>
                                <span className="time-text">hrs</span>
                            </div>

                            {/* x */}
                            <div className="x-div">
                                <span className="x-text">x</span>
                            </div>

                            {/* rate */}
                            <div className="rate-div">
                                <span className="time-text">{rate}</span>
                                <span className="time-text">฿/hr</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ปุ่ม Add coupons */}
                <button
                    className="coupon-btn"
                    onClick={() => setShowModal(true)}
                >
                    Add coupons
                </button>
                {showModal && (
                    <div className="booking-section">
                        <div className="booking-section2">
                            <p className="coupons-header">Coupons</p>
                            {/* Coupons list */}
                            <div className="time-mapping">
                                {coupons.map((time) => (
                                    <div
                                        key={time}
                                        className={`p-2 text-center cursor-pointer ${
                                            selectedCoupons === time
                                                ? "bg-blue-500 text-white"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => setSelectedCoupons(time)}
                                    >
                                        {time}
                                    </div>
                                ))}
                            </div>

                            {/* Points selector */}
                            <div className="points-section">
                                <div className="points-current">
                                    <p>{points} Points</p>
                                </div>
                                <div className="points-btn-div">
                                    <button
                                        onClick={() => reductPointsRedeem(1)}
                                        disabled={pointsRedeem <= 0}
                                        className="points-btn"
                                    >
                                        -
                                    </button>
                                    <p className="points-text">
                                        {pointsRedeem}
                                    </p>
                                    <button
                                        onClick={() => addPointsRedeem(1)}
                                        className="points-btn"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="button-section">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setholidayDiscountLabel(
                                            selectedCoupons
                                        );
                                    }}
                                    disabled={!selectedCoupons}
                                    className={`px-3 py-2 rounded ${
                                        selectedCoupons
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* เส้นคั่น */}
                <hr className="summary-divider" />

                {/* สรุปเงิน */}
                <div className="price-summary">
                    {/* base price */}
                    <div className="price-row">
                        <div className="price-left-half" />
                        <div className="price-right-half">
                            <div className="price-col-end">
                                <div className="price-inline">
                                    <span className="price-number">
                                        {basePrice}
                                    </span>
                                    <span>฿</span>
                                </div>
                                <span className="price-minus-mark">-</span>
                            </div>
                        </div>
                    </div>

                    {/* holiday discount */}
                    <div className="price-row price-row-topgap-small">
                        <div className="price-left-half align-left">
                            {holidayDiscountLabel}
                        </div>
                        <div className="price-right-half">
                            <div className="price-col-end">
                                <div className="price-inline">
                                    <span className="price-number">
                                        {holidayDiscount}
                                    </span>
                                    <span>฿</span>
                                </div>
                                <span className="price-minus-mark">-</span>
                            </div>
                        </div>
                    </div>

                    {/* point reduction */}
                    <div className="price-row price-row-topgap-medium">
                        <div className="price-left-half align-left">
                            Point reduction
                        </div>
                        <div className="price-right-half">
                            <div className="price-inline">
                                <span className="price-number">
                                    {pointReduction}
                                </span>
                                <span>฿</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* เส้นคั่น */}
                <hr className="summary-divider summary-divider-gap" />

                {/* total */}
                <div className="total-row">
                    <div className="total-inline">
                        <span className="total-number">{total}</span>
                        <span>฿</span>
                    </div>
                </div>
            </div>

            {/* Footer ปุ่ม */}
            <div className="footer-row">
                <Link href="/home" className="footer-btn footer-btn-link">
                    Go Home
                </Link>
                <button className="footer-btn footer-btn-pay">Pay</button>
            </div>
        </div>
    );
}
