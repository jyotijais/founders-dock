import { useState } from 'react';
import emailjs from 'emailjs-com';

const ContactModal = ({pitch, onClose}) => {
    const [formData, setFormData] = useState({name: '', email: '', message: ''});
    const [sent, setSent] = useState(false);

    const handleChange = (e) => 
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const sendEmail = async (e) => {
        e.preventDefault();

        try {
            await emailjs.send(
                
                "service_r4pu6yg",
                "template_bx84ze5",
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    to_name: pitch.founderName,
                    to_email: pitch.founderEmail,
                    message: formData.message,
                    startup_name: pitch.startupName,
                },
                "H5Ml0zI9vlP8pXZDl"
            );
            setSent(true);
        } catch (err) {
            console.error('Error sending email ❌:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded max-w-md w-full shadow-lg relative">
                <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✖</button>
                <h2 className="text-xl font-semibold mb-4">Contact {pitch.founderName}</h2>

                {sent ? (
                    <p className="text-green-600">Message sent successfully ✅</p>
                ): (
                    <form onSubmit={sendEmail} className="space-y-2">
                        <input 
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            required
                            className="w-full border p-2 rounded"
                            onChange={handleChange}
                        />
                        <input 
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            required
                            className="w-full border p-2 rounded"
                            onChange={handleChange}
                        />
                        <textarea
                            name="message"
                            rows="4"
                            placeholder="Message..."
                            required
                            className="w-full border p-2 rounded"
                            onChange={handleChange}
                        />
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                            Send
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
export default ContactModal;