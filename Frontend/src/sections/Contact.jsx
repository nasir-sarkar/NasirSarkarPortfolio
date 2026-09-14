import React, { useRef, useState, useEffect } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import SectionHeader from '../components/ui/SectionHeader'
import SocialLinks from '../components/ui/SocialLinks'
import Button from '../components/ui/Button'
import axios from '../api/axios'
import { useLoading } from '../context/LoadingContext'

const INITIAL_FORM = { name: '', email: '', phone: '', subject: '', message: '' }

const INPUT_CLASS =
  'contact-input w-full px-[14px] py-[10px] border border-[#e5e5e5] rounded-[4px] text-[14px] text-[#0d0d0d] bg-white transition-all duration-300 outline-none focus:border-[#f9004d] resize-none'

const contactFormFields = [
  { name: 'name',    type: 'text',  placeholder: 'Your Name',    required: true },
  { name: 'email',   type: 'email', placeholder: 'Your Email',   required: true },
  { name: 'phone',   type: 'text',  placeholder: 'Phone Number', required: false },
  { name: 'subject', type: 'text',  placeholder: 'Subject',      required: true },
]


export default function Contact() {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [toast, setToast] = useState({ show: false, msg: '' })
  const [contactInfo, setContactInfo] = useState([])
  const [socialLinks, setSocialLinks] = useState([])
  const { markReady } = useLoading()


  useEffect(() => {
    axios.get('/contact/getContact')
      .then((res) => {
        setContactInfo(res.data.contactInfo || [])
        setSocialLinks(res.data.socialLinks || [])
        markReady('contact')
      })
      .catch((err) => console.error('Failed to fetch contact data:', err))
  }, [])


  useIntersectionObserver([
    { ref: leftRef, animClass: 'fade-left' },
    { ref: rightRef, animClass: 'fade-right' },
  ])


  const showToast = (msg) => {
    setToast({ show: true, msg })
    setTimeout(() => setToast({ show: false, msg: '' }), 3500)
  }


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/messages/sendMessage', form)
      if (res.data.success) {
        showToast('Message sent successfully! :)')
        setForm(INITIAL_FORM)
      } else {
        showToast('Failed to send. Please try again. :(')
      }
    } catch (err) {
      console.error(err)
      showToast('Server error')
    }
  }


  
  return (
    <>
      <section id="contact" className="bg-white py-[80px]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex gap-[50px] items-start flex-col lg:flex-row">


            <div ref={leftRef} className="lg:w-[380px] shrink-0 w-full">
              <SectionHeader
                eyebrow="Get in Touch"
                title="Get in Touch"
                subtitle="Feel free to get in touch with me. I am always open to discussing new projects, creative ideas or opportunities to be part of my visions of success in life."
                center={false}
                className="mb-[20px]"
              />


              <div className="mb-[20px] space-y-[14px]">
                {contactInfo.map((item, i) => (
                  <div key={i} className="contact-info-item flex items-start gap-3">
                    <div className="contact-icon w-[40px] h-[40px] bg-[rgba(232,25,44,0.08)] rounded-full flex items-center justify-center text-[#f9004d] text-[15px] shrink-0">
                      <i className={item.icon} />
                    </div>
                    <div>
                      <h6 className="text-[12px] font-[600] text-[#777] uppercase tracking-wide mb-1">
                        {item.label}
                      </h6>
                      <a href={item.href} className="text-[14px] text-[#0d0d0d] font-[500] hover:text-[#f9004d] transition-all duration-300">
                        {item.val}
                      </a>
                    </div>
                  </div>
                ))}
              </div>


              <div>
                <h5 className="text-[15px] font-[700] text-[#0d0d0d] mb-[10px]">Follow Me</h5>
                <SocialLinks variant="dark" links={socialLinks} />
              </div>
            </div>


            <div ref={rightRef} className="flex-1 w-full">
              <div className="bg-[#f4f4f4] p-[22px] rounded-[8px] w-full max-w-[500px] ml-auto">
                <h4 className="text-[20px] font-[700] text-[#0d0d0d] mb-4">Contact Us</h4>
                <form onSubmit={handleSubmit}>
                  {contactFormFields.map((field) => (
                    <div key={field.name} className="mb-3">
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={form[field.name]}
                        onChange={handleChange}
                        className={INPUT_CLASS}
                      />
                    </div>
                  ))}
                  <div className="mb-3">
                    <textarea
                      rows={4}
                      name="message"
                      placeholder="Message"
                      required
                      value={form.message}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <Button as="button" type="submit" variant="filled" className="w-full text-center">
                    Submit
                  </Button>
                </form>
              </div>
            </div>


          </div>
        </div>
      </section>

      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.msg}</div>
    </>
  )
}