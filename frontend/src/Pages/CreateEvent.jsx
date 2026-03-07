import { useState, useEffect } from "react";
import { Upload, X, Loader2, Home, ChevronRight } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { eventsAPI } from "../api/index.js";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore.js";

/* ─── Field wrapper ─────────────────────────────────────────────────── */
const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white";

/* ─── Main ──────────────────────────────────────────────────────────── */
const CreateEvent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    event_title: "", event_description: "",
    event_start_date: "", event_end_date: "",
    event_start_time: "", event_end_time: "",
    event_location: "", event_price: "", image_url: "",
  });

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) { setEditMode(true); setEventId(editId); fetchEvent(editId); }
  }, [searchParams]);

  const fetchEvent = async (id) => {
    try {
      setFetchingEvent(true);
      const res = await eventsAPI.getById(id);
      if (res.data.success) {
        const e = res.data.data;
        if (e.user_id !== user.id) { toast.error("You can only edit your own events"); navigate("/event-listings"); return; }
        const s = new Date(e.event_start_date), en = new Date(e.event_end_date);
        setForm({
          event_title:       e.event_title        || "",
          event_description: e.event_description  || "",
          event_start_date:  s.toISOString().split("T")[0],
          event_end_date:    en.toISOString().split("T")[0],
          event_start_time:  s.toTimeString().slice(0, 5),
          event_end_time:    en.toTimeString().slice(0, 5),
          event_location:    e.event_location     || "",
          event_price:       e.event_price?.toString() || "",
          image_url:         e.image_url          || "",
        });
        if (e.image_url) setImagePreview(e.image_url);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load event");
      navigate("/event-listings");
    } finally { setFetchingEvent(false); }
  };

  const change = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))    { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024)       { toast.error("Image must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => { setImagePreview(reader.result); setForm(p => ({ ...p, image_url: reader.result })); };
    reader.readAsDataURL(file);
  };

  const removeImage = () => { setImagePreview(null); setForm(p => ({ ...p, image_url: "" })); };

  const validate = () => {
    if (!form.event_title      || form.event_title.length < 3)       { toast.error("Title must be at least 3 characters"); return false; }
    if (!form.event_description|| form.event_description.length < 10){ toast.error("Description must be at least 10 characters"); return false; }
    if (!form.event_start_date)                                       { toast.error("Start date is required"); return false; }
    if (!form.event_end_date)                                         { toast.error("End date is required"); return false; }
    if (new Date(form.event_start_date) > new Date(form.event_end_date)) { toast.error("End date must be after start date"); return false; }
    if (!form.event_location   || form.event_location.length < 3)    { toast.error("Location must be at least 3 characters"); return false; }
    if (!form.event_price      || parseFloat(form.event_price) < 0)  { toast.error("Valid price is required"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!user) { toast.error("Please login to create an event"); navigate("/login"); return; }
    setLoading(true);
    try {
      const mkDT = (d, t) => t ? new Date(`${d}T${t}`).toISOString() : new Date(d).toISOString();
      const data = {
        user_id: user.id,
        event_title:       form.event_title,
        event_description: form.event_description,
        event_start_date:  mkDT(form.event_start_date, form.event_start_time),
        event_end_date:    mkDT(form.event_end_date,   form.event_end_time),
        event_location:    form.event_location,
        event_price:       parseFloat(form.event_price),
        image_url:         form.image_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
      };
      const res = editMode && eventId ? await eventsAPI.update(eventId, data) : await eventsAPI.create(data);
      if (res.data.success) {
        toast.success(editMode ? "Event updated!" : "Event created!");
        setTimeout(() => navigate("/event-listings"), 1200);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save event");
    } finally { setLoading(false); }
  };

  if (fetchingEvent) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-gray-400" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 w-screen">

      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 h-14 text-[13px] text-gray-400">
            <Link to="/" className="hover:text-gray-600 transition-colors"><Home size={13} /></Link>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium">{editMode ? "Edit Event" : "Create Event"}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <p className="text-lg font-bold text-gray-900">{editMode ? "Edit Event" : "Create a New Event"}</p>
          <p className="text-[13px] text-gray-400 mt-0.5">{editMode ? "Update your event details below." : "Fill in the details to publish your event."}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            <Field label="Event Title" required>
              <input type="text" name="event_title" placeholder="e.g. Nairobi Tech Summit 2026"
                value={form.event_title} onChange={change} className={inputCls} />
            </Field>

            <Field label="Description" required>
              <textarea name="event_description" placeholder="Describe your event…" rows={5}
                value={form.event_description} onChange={change}
                className={`${inputCls} resize-none`} />
            </Field>

            <Field label="Price (KES)" required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-gray-400">KES</span>
                <input type="number" name="event_price" placeholder="0" min={0} step="0.01"
                  value={form.event_price} onChange={change}
                  className={`${inputCls} pl-10`} />
              </div>
            </Field>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Field label="Start Date" required>
                  <input type="date" name="event_start_date" value={form.event_start_date} onChange={change} className={inputCls} />
                </Field>
                <Field label="Start Time">
                  <input type="time" name="event_start_time" value={form.event_start_time} onChange={change} className={inputCls} />
                </Field>
              </div>
              <div className="space-y-4">
                <Field label="End Date" required>
                  <input type="date" name="event_end_date" value={form.event_end_date} onChange={change} className={inputCls} />
                </Field>
                <Field label="End Time">
                  <input type="time" name="event_end_time" value={form.event_end_time} onChange={change} className={inputCls} />
                </Field>
              </div>
            </div>

            <Field label="Location" required>
              <input type="text" name="event_location" placeholder="e.g. Nairobi Convention Center"
                value={form.event_location} onChange={change} className={inputCls} />
            </Field>

            {/* Image */}
            <Field label="Event Image">
              <div className="space-y-3">
                {imagePreview && (
                  <div className="relative w-full max-w-sm">
                    <img src={imagePreview} alt="Preview"
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                      onError={e => { e.target.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400"; }} />
                    <button type="button" onClick={removeImage}
                      className="absolute top-2 right-2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow-sm">
                      <X size={12} />
                    </button>
                  </div>
                )}

                <label className="block cursor-pointer">
                  <div className="border border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-gray-900 transition-colors">
                    <Upload size={18} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-[12px] text-gray-400">Click to upload image</p>
                    <p className="text-[11px] text-gray-300 mt-0.5">PNG, JPG up to 5MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-300 uppercase tracking-wider">URL</span>
                  <input type="url" name="image_url" placeholder="https://example.com/image.jpg"
                    value={form.image_url} onChange={change}
                    onBlur={e => { if (e.target.value && !imagePreview) setImagePreview(e.target.value); }}
                    className={`${inputCls} pl-12`} />
                </div>
              </div>
            </Field>

            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading
                  ? <><Loader2 size={14} className="animate-spin" />{editMode ? "Updating…" : "Creating…"}</>
                  : editMode ? "Update Event" : "Create Event"
                }
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;