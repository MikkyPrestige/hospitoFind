import { FiSave, FiMapPin, FiClock, FiImage, FiActivity, FiZap, FiSearch, FiAlertTriangle, FiCheck, FiMessageSquare, FiPlus, FiX } from "react-icons/fi";
import styles from "./styles/adminHospitalForm.module.scss";
import { standardizeText } from "@/utils/formatters";
import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Hours } from "@/src/types/hospital";

interface AdminHospitalFormProps {
    formData: any;
    setFormData: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    title: string;
}

const AdminHospitalForm = ({ formData, setFormData, onSubmit, loading, title }: AdminHospitalFormProps) => {
    const [dupCheckLoading, setDupCheckLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    const handleStandardize = () => {
        setFormData({
            ...formData,
            name: standardizeText(formData.name),
            type: standardizeText(formData.type),
            address: {
                street: standardizeText(formData.address?.street || ""),
                city: standardizeText(formData.address?.city || ""),
                state: standardizeText(formData.address?.state || ""),
                country: standardizeText(formData.address?.country || "Nigeria"),
            },
            email: formData.email?.toLowerCase().trim() || "",
            website: formData.website?.toLowerCase().trim() || "",
            services: typeof formData.services === 'string'
                ? formData.services.split(",").map((s: string) => s.trim()).filter(Boolean)
                : formData.services,
            photoUrl: formData.photoUrl?.trim() || "",
        });
        toast.info("Text standardized and cleaned.");
    };

    const addHourRow = () => {
        setFormData({
            ...formData,
            hours: [...(formData.hours || []), { day: "Monday", open: "24 Hours" }]
        });
    };

    const removeHourRow = (index: number) => {
        const newHours = [...formData.hours];
        newHours.splice(index, 1);
        setFormData({ ...formData, hours: newHours });
    };

    const updateHourRow = (index: number, field: keyof Hours, value: string) => {
        const newHours = [...formData.hours];
        newHours[index] = { ...newHours[index], [field]: value };
        setFormData({ ...formData, hours: newHours });
    };

    const handleSet247 = () => {
        const fullWeek247 = [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ].map(day => ({ day, open: "24 Hours" }));

        setFormData({ ...formData, hours: fullWeek247 });
    };

    const handleCheckDuplicate = async () => {
        const name = formData.name;
        const city = formData.address?.city;

        if (!name || !city) {
            return toast.warn("Enter Name and City first to check for duplicates.");
        }

        setDupCheckLoading(true);
        try {
            const { data } = await axiosPrivate.get(
                `/hospitals/check-duplicate?name=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}&currentId=${formData._id || ""}`
            );

            if (data.isDuplicate) {
                toast.error(data.message, { icon: <FiAlertTriangle /> });
            } else {
                toast.success("No duplicates found in this city.", { icon: <FiCheck /> });
            }
        } catch (err) {
            toast.error("Duplicate check unavailable.");
        } finally {
            setDupCheckLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className={styles.adminForm}>
            <div className={styles.formHeaderRow}>
                <h3 className={styles.formTitle}>{title}</h3>
                <button
                    type="button"
                    className={styles.standardizeBtn}
                    onClick={handleStandardize}
                    title="Clean up and Capitalize text"
                >
                    <FiZap /> Standardize
                </button>
            </div>

            {/* --- Photo Section --- */}
            <div className={styles.photoPreviewSection}>
                <label className={styles.sectionLabel}><FiImage /> Facility Media</label>
                <div className={styles.previewContainer}>
                    {formData.photoUrl ? (
                        <img
                            src={formData.photoUrl}
                            alt="Hospital Preview"
                            className={styles.livePreview}
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL')}
                        />
                    ) : (
                        <div className={styles.placeholderPreview}>No Image URL Provided</div>
                    )}
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Paste Photo URL here (Cloudinary, S3, etc.)"
                        value={formData.photoUrl || ""}
                        onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                    />
                </div>
            </div>

            {/* --- General Info --- */}
            <div className={styles.formSection}>
                <label className={styles.sectionLabel}><FiActivity /> Identification</label>
                <div className={styles.inputWithAction}>
                    <input
                        type="text"
                        placeholder="Official Hospital Name *"
                        required
                        value={formData.name || ""}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={handleCheckDuplicate}
                        disabled={dupCheckLoading}
                        className={styles.innerActionBtn}
                        title="Check database for existing entry"
                    >
                        {dupCheckLoading ? "..." : <FiSearch />}
                    </button>
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Facility Type (e.g. Private Specialist, General Public)"
                        value={formData.type || ""}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                    />
                </div>
            </div>

            {/* --- Location --- */}
            <div className={styles.formSection}>
                <label className={styles.sectionLabel}><FiMapPin /> Location Geography</label>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Street Address"
                        value={formData.address?.street || ""}
                        onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                    />
                </div>
                <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="City *"
                            required
                            value={formData.address?.city || ""}
                            onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="State *"
                            required
                            value={formData.address?.state || ""}
                            onChange={e => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                        />
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                        <input type="number" step="any" placeholder="Longitude" value={formData.longitude || ""} onChange={e => setFormData({ ...formData, longitude: e.target.value })} />
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="number" step="any" placeholder="Latitude" value={formData.latitude || ""} onChange={e => setFormData({ ...formData, latitude: e.target.value })} />
                    </div>
                </div>
            </div>

            {/* --- Contact --- */}
            <div className={styles.formSection}>
                <label className={styles.sectionLabel}><FiImage /> Communication</label>
                <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                        <input type="tel" placeholder="Phone Number" value={formData.phoneNumber || ""} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="email" placeholder="Email Address" value={formData.email || ""} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <input type="text" placeholder="Official Website URL" value={formData.website || ""} onChange={e => setFormData({ ...formData, website: e.target.value })} />
                </div>
            </div>

            {/* --- Services & Comments --- */}
            <div className={styles.formSection}>
                <label className={styles.sectionLabel}><FiZap /> Clinical Services</label>
                <textarea
                    placeholder="List services separated by commas (e.g. Surgery, Lab, MRI)"
                    value={Array.isArray(formData.services) ? formData.services.join(", ") : formData.services || ""}
                    onChange={e => setFormData({ ...formData, services: e.target.value })}
                    className={styles.commentArea}
                />
            </div>

            <div className={styles.formSection}>
                <label className={styles.sectionLabel}><FiMessageSquare /> Admin Notes & Comments</label>
                <textarea
                    placeholder="Internal notes or user-facing comments..."
                    className={styles.commentArea}
                    value={Array.isArray(formData.comments) ? formData.comments.join("\n") : formData.comments || ""}
                    onChange={e => setFormData({ ...formData, comments: e.target.value.split("\n") })}
                />
            </div>

            {/* --- Operating Hours --- */}
            <div className={styles.formSection}>
                <div className={styles.labelHeader}>
                    <label className={styles.sectionLabel}><FiClock /> Operating Hours</label>
                    <div className={styles.labelActions}>
                        <button type="button" onClick={handleSet247} className={styles.zapBtn}>
                            <FiZap size={14} /> Set 24/7
                        </button>
                        <button type="button" onClick={addHourRow} className={styles.addBtn}>
                            <FiPlus size={14} /> Add Day
                        </button>
                    </div>
                </div>
                <div className={styles.hoursList}>
                    {formData.hours?.map((hour: Hours, index: number) => (
                        <div key={index} className={styles.hourRow}>
                            <select
                                value={hour.day}
                                onChange={(e) => updateHourRow(index, 'day', e.target.value)}
                            >
                                <option>Monday</option>
                                <option>Tuesday</option>
                                <option>Wednesday</option>
                                <option>Thursday</option>
                                <option>Friday</option>
                                <option>Saturday</option>
                                <option>Sunday</option>
                                <option>Everyday</option>
                            </select>
                            <input
                                type="text"
                                placeholder="e.g. 08:00 - 18:00"
                                value={hour.open}
                                onChange={(e) => updateHourRow(index, 'open', e.target.value)}
                            />
                            <button type="button" onClick={() => removeHourRow(index)} className={styles.removeBtn}>
                                <FiX />
                            </button>
                        </div>
                    ))}
                    {(!formData.hours || formData.hours.length === 0) && (
                        <p className={styles.emptyNote}>Click 'Add Day' to specify operating times.</p>
                    )}
                </div>
            </div>

            <div className={styles.checkboxGroup}>
                <label className={styles.checkLabel}>
                    <input
                        type="checkbox"
                        checked={formData.verified || false}
                        onChange={e => setFormData({ ...formData, verified: e.target.checked })}
                    />
                    <span>Verified (Visible to Public)</span>
                </label>

                <label className={styles.checkLabel}>
                    <input
                        type="checkbox"
                        checked={formData.isFeatured || false}
                        onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    <span>Featured Entry</span>
                </label>
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
                <FiSave /> {loading ? "Saving Changes..." : "Commit Entry to Database"}
            </button>
        </form>
    );
};

export default AdminHospitalForm;