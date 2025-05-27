'use client'

import type React from 'react'
import { useState } from 'react'
import {
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLink,
} from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { toast } from 'react-toastify'

interface ShareProductProps {
  productId: string
  productName: string
}

const ShareProduct: React.FC<ShareProductProps> = ({
  productId,
  productName,
}) => {
  const [showShareOptions, setShowShareOptions] = useState(false)

  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/product/${productId}`
      : `/product/${productId}`

  const shareText = `Check out ${productName} on our store!`

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <FaFacebook size={20} className="text-blue-600" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        productUrl
      )}`,
    },
    {
      name: 'Twitter',
      icon: <FaTwitter size={20} className="text-blue-400" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(productUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp size={20} className="text-green-500" />,
      url: `https://wa.me/?text=${encodeURIComponent(
        `${shareText} ${productUrl}`
      )}`,
    },
    {
      name: 'Email',
      icon: <MdEmail size={20} className="text-gray-600" />,
      url: `mailto:?subject=${encodeURIComponent(
        shareText
      )}&body=${encodeURIComponent(productUrl)}`,
    },
  ]

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(productUrl)
      .then(() => {
        toast.success('Link copied to clipboard!')
      })
      .catch(() => {
        toast.error('Failed to copy link')
      })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        aria-label="Share product"
      >
        <FaShareAlt size={18} />
        <span>Share</span>
      </button>

      {showShareOptions && (
        <div className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-lg border w-56">
          <div className="flex flex-col gap-2">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
                onClick={() => setShowShareOptions(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </a>
            ))}
            <button
              onClick={() => {
                copyToClipboard()
                setShowShareOptions(false)
              }}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
            >
              <FaLink size={20} className="text-gray-600" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShareProduct
