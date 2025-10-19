'use client'

import { Star } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Toy Seller, United States',
    content: 'This tool saved our product from being delisted on Amazon. It caught compliance issues we completely overlooked in our toy packaging. Worth every penny!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1654723011673-86b0eae447a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbHxlbnwwfHx8fDE3NTk1MzA3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ringColor: 'ring-orange-100 group-hover:ring-orange-200 dark:ring-orange-950 dark:group-hover:ring-orange-900',
  },
  {
    name: 'Michael Chen',
    role: 'E-commerce Manager, United Kingdom',
    content: 'As a UK seller navigating post-Brexit regulations, this tool has been invaluable. It helped us correctly implement UKCA markings and Responsible Person details.',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbHxlbnwwfHx8fDE3NTk1MzA3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ringColor: 'ring-blue-100 group-hover:ring-blue-200 dark:ring-blue-950 dark:group-hover:ring-blue-900',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Product Manager, Germany',
    content: 'The detailed reports and recommendations have transformed our compliance process. We\'ve reduced listing rejections by 90% since using this tool.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbHxlbnwwfHx8fDE3NTk1MzA3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ringColor: 'ring-green-100 group-hover:ring-green-200 dark:ring-green-950 dark:group-hover:ring-green-900',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-semibold mb-6">
            <Star className="w-4 h-4 mr-2" />
            Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-orange-900 dark:from-gray-100 dark:via-blue-100 dark:to-orange-100 bg-clip-text text-transparent px-4">
            What Our Clients Say
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Hear from sellers who have improved their compliance with our tool and achieved better marketplace success.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50 dark:border-slate-800/50"
            >
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(testimonial.rating)
                        ? 'text-yellow-400 fill-current'
                        : i < testimonial.rating
                        ? 'text-yellow-400 fill-current opacity-50'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 dark:text-gray-400 mb-8 italic text-lg leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-full overflow-hidden mr-4 ring-4 ${testimonial.ringColor} transition-all duration-300 relative`}>
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

