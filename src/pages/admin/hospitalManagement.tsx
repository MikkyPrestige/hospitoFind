import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
    FiPlus, FiEdit, FiTrash2,
    FiSearch, FiFilter, FiX, FiCheckCircle, FiClock, FiActivity, FiXCircle
} from "react-icons/fi";
import { toast } from "react-toastify";
import AdminHospitalForm from "@/components/admin/AdminHospitalForm";
import styles from "./styles/scss/hospitalManagement/hospitalManagement.module.scss";
import { HospitalFormData } from "@/services/hospital";

const HospitalManagement = () => {
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [formData, setFormData] = useState<HospitalFormData>({
        name: "",
        type: "",
        street: "",
        city: "",
        state: "",
        phoneNumber: "",
        email: "",
        website: "",
        photoUrl: "",
        services: "",
        comments: [],
        hours: [],
        longitude: "",
        latitude: "",
        isFeatured: false,
        verified: false
    });

    const axiosPrivate = useAxiosPrivate();

    const fetchHospitals = async () => {
        try {
            setIsLoading(true);
            const response = await axiosPrivate.get("/admin/hospitals");
            setHospitals(response.data);
        } catch (err) {
            toast.error("Failed to load directory");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchHospitals(); }, []);

    const handleOpenAdd = () => {
        setIsEditing(false);
        setFormData({
            name: "", type: "", street: "", city: "", state: "",
            phoneNumber: "", email: "", website: "", photoUrl: "",
            services: "", comments: [], hours: [], longitude: "",
            latitude: "", isFeatured: false, verified: true
        });
        setShowModal(true);
    };

    const handleOpenEdit = (hosp: any) => {
        setIsEditing(true);
        setSelectedId(hosp._id);
        setFormData({
            _id: hosp._id,
            name: hosp.name,
            type: hosp.type || "",
            street: hosp.address?.street || "",
            city: hosp.address?.city || "",
            state: hosp.address?.state || "",
            phoneNumber: hosp.phoneNumber || "",
            email: hosp.email || "",
            website: hosp.website || "",
            photoUrl: hosp.photoUrl || "",
            services: hosp.services?.join(", ") || "",
            comments: hosp.comments || [],
            hours: hosp.hours || [],
            longitude: hosp.longitude || "",
            latitude: hosp.latitude || "",
            isFeatured: hosp.isFeatured || false,
            verified: hosp.verified || false
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axiosPrivate.patch(`/hospitals/${selectedId}`, formData);
                toast.success("Hospital updated!");
            } else {
                await axiosPrivate.post("/hospitals", formData);
                toast.success("Hospital created!");
            }
            setShowModal(false);
            fetchHospitals();
        } catch (err) {
            toast.error("Operation failed");
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await axiosPrivate.patch(`/admin/hospitals/${id}/toggle-status`);
            toast.success("Status updated successfully");
            fetchHospitals();
        } catch (err) {
            toast.error("Status update failed");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            await axiosPrivate.delete(`/hospitals/${id}`);
            toast.success("Entry removed");
            fetchHospitals();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    // Search, Filter, and Dynamic Sort
    const filteredHospitals = hospitals
        .filter((h) => {
            const matchesSearch =
                h.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.address?.city?.toLowerCase().includes(searchTerm.toLowerCase());

            const isVerified = h.verified === true;
            const isPending = h.verified === false || h.verified === undefined;

            if (filter === "verified") return matchesSearch && isVerified;
            if (filter === "unverified") return matchesSearch && isPending;

            return matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleRow}>
                    <div>
                        <h1>Hospital Directory</h1>
                        <p>Managing {hospitals.length} entries in the global database</p>
                    </div>
                    <button className={styles.addBtn} onClick={handleOpenAdd}>
                        <FiPlus /> Add New Hospital
                    </button>
                </div>
            </header>

            <div className={styles.controls}>
                <div className={styles.searchBar}>
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search by name or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.filterBox}>
                        <FiFilter />
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All Status</option>
                            <option value="verified">Live / Verified</option>
                            <option value="unverified">Pending Review</option>
                        </select>
                    </div>

                    <div className={styles.filterBox}>
                        <FiActivity />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="newest">Recently Created</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Alphabetical (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                {isLoading ? (
                    <div className={styles.loading}>Synchronizing database...</div>
                ) : (
                    <table className={styles.hospTable}>
                        <thead>
                            <tr>
                                <th>Hospital</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHospitals.map(h => (
                                <tr key={h._id}>
                                    <td className={styles.nameCell}>
                                        <strong>{h.name}</strong>
                                        <span>{h.type}</span>
                                    </td>
                                    <td>{h.address?.city}, {h.address?.state}</td>
                                    <td>
                                        <span className={h.verified ? styles.statusVerified : styles.statusPending}>
                                            {h.verified ? <><FiCheckCircle /> Live</> : <><FiClock /> Pending</>}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        <button
                                            onClick={() => handleToggleStatus(h._id)}
                                            className={h.verified ? styles.unverifyBtn : styles.verifyBtn}
                                            title={h.verified ? "Set to Pending" : "Set to Live"}
                                        >
                                            {h.verified ? <FiXCircle /> : <FiCheckCircle />}
                                        </button>

                                        <button onClick={() => handleOpenEdit(h)} className={styles.editBtn} title="Edit"><FiEdit /></button>
                                        <button onClick={() => handleDelete(h._id, h.name)} className={styles.deleteBtn} title="Delete"><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODAL OVERLAY */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                            <FiX />
                        </button>
                        <AdminHospitalForm
                            title={isEditing ? "Edit Hospital Entry" : "Create New Entry"}
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            loading={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalManagement;