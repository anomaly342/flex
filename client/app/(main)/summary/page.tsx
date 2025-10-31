"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "./summary.css";

interface UserProfile {
    id: number;
    username: string;
    role: string;
    exp_date: null;
    points: number;
}

interface Coupon {
    label: string; // ข้อความโชว์ใน UI
    type: "percent" | "flat"; // ลดเป็น % หรือ ลดเป็นจำนวนบาท
    value: number; // ถ้า percent = 15 หมายถึง 15%
    cap?: number; // วงเงินลดสูงสุด (optional)
}

export default function OrderSummary() {
    const router = useRouter();
    const sp = useSearchParams();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // -------- MOCK MODE FOR UI TEST --------
        const mockUser: UserProfile = {
            id: 1,
            username: "Alice",
            role: "Membership",
            exp_date: null,
            points: 23423,
        };
        setUser(mockUser);
        setLoading(false);

        // const loadUser = async () => {
        //     try {
        //         const res = await fetch(
        //             `${process.env.NEXT_PUBLIC_BACKEND_URL}/authentication/me`,
        //             {
        //                 method: "GET",
        //                 credentials: "include",
        //             }
        //         );

        //         if (!res.ok) {
        //             router.replace("/login");
        //             return;
        //         }

        //         const data: UserProfile = await res.json();
        //         setUser(data);
        //     } catch (err) {
        //         console.error("Failed to load user", err);
        //         router.replace("/login");
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // loadUser();
    }, [router]);

    // -----------------------
    // mock booking info (จะมาแทนด้วยค่าจริงจาก URL/database ทีหลัง)
    // -----------------------
    const theme = "Japanese";
    const location = "Floor 3, room 4";

    const startTime = "9.00";
    const endTime = "15.00";

    const hours = 6; // จำนวนชั่วโมง
    const rate = 50; // ฿/hr
    const basePrice = hours * rate; // 6 * 50 = 300

    const coupons: Coupon[] = [
        { label: "-15% ปีใหม่", type: "percent", value: 15 },
        {
            label: "-15% สงกรานต์ (ลดสูงสุด 100 บาท)",
            type: "percent",
            value: 15,
            cap: 100,
        },
        {
            label: "-10% ช่วงสอบ (ลดสูงสุด 100 บาท)",
            type: "percent",
            value: 10,
            cap: 100,
        },
    ];

    const [showModal, setShowModal] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

    const [currentPoints, setCurrentPoints] = useState<number>(0);

    const [pointsRedeem, setPointsRedeem] = useState<number>(0);

    // sync currentPoints
    useEffect(() => {
        if (user) {
            setCurrentPoints(user.points);
        }
    }, [user]);

    // config: 1 แต้มลดกี่บาท
    const BAHT_PER_POINT = 0.01;

    const addPointsRedeem = (num: number) => {
        if (!user) return;

        if (currentPoints <= 0) return;

        setCurrentPoints((prev) => (prev - num < 0 ? 0 : prev - num));
        setPointsRedeem((prev) => prev + num);
    };

    const reductPointsRedeem = (num: number) => {
        if (pointsRedeem <= 0) return;

        setCurrentPoints((prev) => prev + num);
        setPointsRedeem((prev) => (prev - num < 0 ? 0 : prev - num));
    };

    const couponDiscount = useMemo(() => {
        if (!selectedCoupon) return 0;

        if (selectedCoupon.type === "flat") {
            return selectedCoupon.value;
        }

        if (selectedCoupon.type === "percent") {
            const rawDiscount = (basePrice * selectedCoupon.value) / 100;

            if (selectedCoupon.cap !== undefined) {
                return Math.min(rawDiscount, selectedCoupon.cap);
            }
            return rawDiscount;
        }

        return 0;
    }, [selectedCoupon, basePrice]);

    const pointReduction = useMemo(() => {
        return pointsRedeem * BAHT_PER_POINT;
    }, [pointsRedeem]);

    const total = useMemo(() => {
        const result = basePrice - couponDiscount - pointReduction;
        return result < 0 ? 0 : result;
    }, [basePrice, couponDiscount, pointReduction]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="maindiv">
            <div className="content">
                <p className="title-text">Order Summary</p>
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

                <div className="duration-section">
                    <p className="detail-text">Duration</p>
                    <div className="duration-div">
                        <div className="detail-div">
                            <p>
                                {startTime}-{endTime} =
                            </p>
                        </div>

                        <div className="detail-div">
                            <div className="hour-div">
                                <span className="time-text">{hours}</span>
                                <span className="time-text">hrs</span>
                            </div>

                            <div className="x-div">
                                <span className="x-text">x</span>
                            </div>

                            <div className="rate-div">
                                <span className="time-text">{rate}</span>
                                <span className="time-text">฿/hr</span>
                            </div>
                        </div>
                    </div>
                </div>

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
                                {coupons.map((c) => (
                                    <div
                                        key={c.label}
                                        className={`p-2 text-center cursor-pointer ${
                                            selectedCoupon?.label === c.label
                                                ? "bg-blue-500 text-white"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => setSelectedCoupon(c)}
                                    >
                                        {c.label}
                                    </div>
                                ))}
                            </div>

                            {/* Points selector */}
                            <div className="points-section">
                                <div className="points-current">
                                    <p>{currentPoints} Points</p>
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
                                        disabled={!user || currentPoints <= 0}
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
                                        // ไม่มีอะไรต้องทำเพิ่ม เพราะเราเก็บ selectedCoupon แล้ว
                                        // และ pointsRedeem ก็อยู่ใน state แล้ว
                                    }}
                                    disabled={
                                        !selectedCoupon && pointsRedeem === 0
                                    }
                                    className={`px-3 py-2 rounded ${
                                        !selectedCoupon && pointsRedeem === 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <hr className="summary-divider" />
                <div className="price-summary">
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

                    <div className="price-row price-row-topgap-small">
                        <div className="price-left-half align-left">
                            {selectedCoupon ? selectedCoupon.label : ""}
                        </div>
                        <div className="price-right-half">
                            <div className="price-col-end">
                                <div className="price-inline">
                                    <span className="price-number">
                                        {couponDiscount}
                                    </span>
                                    <span>฿</span>
                                </div>
                                <span className="price-minus-mark">-</span>
                            </div>
                        </div>
                    </div>

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

                <hr className="summary-divider summary-divider-gap" />

                <div className="total-row">
                    <div className="total-inline">
                        <span className="total-number">{total}</span>
                        <span>฿</span>
                    </div>
                </div>
            </div>

            <div className="footer-row">
                <Link href="/home" className="footer-btn footer-btn-link">
                    Go Home
                </Link>
                <button className="footer-btn footer-btn-pay">Pay</button>
            </div>
        </div>
    );
}
