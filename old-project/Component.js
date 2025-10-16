import React from "react";



export const Component = () => {
  return (
<div id="webcrumbs"> 
        	<div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
	  {/* Hero Section */}
	  <header className="relative overflow-hidden">
	    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 z-0"></div>
	    <div className="absolute inset-0 bg-black/20 z-0"></div>
	    <img src="https://images.unsplash.com/photo-1715635845581-b1683792ed25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxjb21wbGlhbmNlfGVufDB8fHx8MTc1OTUzMDc2OXww&ixlib=rb-4.1.0&q=80&w=1080" alt="Compliance background" className="absolute inset-0 w-full h-full object-cover z-[-1]" keywords="compliance, regulations, product labels" />
	    
	    <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center backdrop-blur-sm bg-white/10 border-b border-white/20">
	      <div className="flex items-center space-x-3">
	        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
	          <span className="material-symbols-outlined text-white text-2xl">verified</span>
	        </div>
	        <h1 className="text-white text-2xl font-bold tracking-tight">LabelCompliance</h1>
	      </div>
	      
	      <div className="hidden md:flex space-x-8 text-white/90 font-medium">
	        <a href="#features" className="hover:text-white transition-all duration-300 hover:scale-105 relative group">
	          Features
	          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
	        </a>
	        <a href="#marketplaces" className="hover:text-white transition-all duration-300 hover:scale-105 relative group">
	          Marketplaces
	          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
	        </a>
	        <a href="#process" className="hover:text-white transition-all duration-300 hover:scale-105 relative group">
	          How It Works
	          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
	        </a>
	        <a href="#pricing" className="hover:text-white transition-all duration-300 hover:scale-105 relative group">
	          Pricing
	          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
	        </a>
	      </div>
	      
	      <div className="flex items-center space-x-4">
	        <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold">
	          Get Started
	        </button>
	      
	        <button className="md:hidden text-white p-2 hover:bg-white/20 rounded-lg transition-colors">
	          <span className="material-symbols-outlined text-2xl">menu</span>
	        </button>
	      </div>
	    </nav>
	    
	    <div className="flex flex-col gap-4"><div className="relative z-10 container mx-auto px-6 py-24 md:py-40">
	      <div className="max-w-4xl">
	        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
	          <span className="material-symbols-outlined text-lg mr-2">auto_awesome</span>
	          AI-Powered Compliance Analysis
	        </div>
	        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
	          Amazon Label Compliance Reviewer
	        </h1>
	        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl leading-relaxed">
	          Analyze your product labels for compliance with FDA, CPSC, EU/UKCA regulations and Amazon policies. Ensure your toys, baby products, cosmetics, and personal care items meet marketplace requirements.
	        </p>
	        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
	          <button className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 flex items-center justify-center">
	            <span className="material-symbols-outlined mr-2 group-hover:rotate-12 transition-transform duration-300">upload_file</span>
	            Upload Label Now
	          </button>
	          <button className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-10 rounded-full border border-white/30 hover:border-white/50 shadow-xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center">
	            <span className="material-symbols-outlined mr-2 group-hover:translate-x-1 transition-transform duration-300">play_arrow</span>
	            Watch Demo
	          </button>
	        </div>
	        
	        {/* Trust indicators */}
	        <div className="mt-16 flex flex-wrap items-center gap-8 text-white/70">
	          <div className="flex items-center space-x-2">
	            <span className="material-symbols-outlined text-green-400">verified</span>
	            <span className="text-sm font-medium">FDA Approved</span>
	          </div>
	          <div className="flex items-center space-x-2">
	            <span className="material-symbols-outlined text-blue-400">security</span>
	            <span className="text-sm font-medium">Secure & Private</span>
	          </div>
	          <div className="flex items-center space-x-2">
	            <span className="material-symbols-outlined text-purple-400">speed</span>
	            <span className="text-sm font-medium">Instant Results</span>
	          </div>
	        </div>
	      </div>
	    </div>
	<section id="features" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50">
	    <div className="container mx-auto px-6">
	      <div className="text-center mb-20">
	        <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
	          <span className="material-symbols-outlined text-lg mr-2">star</span>
	          Features
	        </div>
	        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
	          Comprehensive Compliance Analysis
	        </h2>
	        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Our tool ensures your products meet all regulatory requirements across multiple marketplaces with AI-powered precision.</p>
	      </div>
	
	      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
	        <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
	          <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
	            <span className="material-symbols-outlined text-purple-600 text-3xl">gavel</span>
	          </div>
	          <h3 className="text-2xl font-bold mb-4 text-gray-900">Regulatory Compliance</h3>
	          <p className="text-gray-600 leading-relaxed">Check against FDA/CPSC (USA), UK Responsible Person, and EU/UKCA standards for complete regulatory coverage.</p>
	        </div>
	        
	        <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
	          <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
	            <span className="material-symbols-outlined text-blue-600 text-3xl">shopping_cart</span>
	          </div>
	          <h3 className="text-2xl font-bold mb-4 text-gray-900">Amazon Policy Verification</h3>
	          <p className="text-gray-600 leading-relaxed">Ensure your labels meet Amazon's specific policies to prevent listing removals and account suspensions.</p>
	        </div>
	        
	        <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
	          <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
	            <span className="material-symbols-outlined text-green-600 text-3xl">category</span>
	          </div>
	          <h3 className="text-2xl font-bold mb-4 text-gray-900">Product Category Focus</h3>
	          <p className="text-gray-600 leading-relaxed">Specialized in toys, baby products, cosmetics, and personal care items with category-specific requirements.</p>
	        </div>
	        
	        <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
	          <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
	            <span className="material-symbols-outlined text-orange-600 text-3xl">upload_file</span>
	          </div>
	          <h3 className="text-2xl font-bold mb-4 text-gray-900">Multiple Format Analysis</h3>
	          <p className="text-gray-600 leading-relaxed">Upload labels as images, PDFs, or text for flexible analysis based on your available materials.</p>
	        </div>
	        
	        <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
	          <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
	            <span className="material-symbols-outlined text-indigo-600 text-3xl">manage_search</span>
	          </div>
	          <h3 className="text-2xl font-bold mb-4 text-gray-900">Detailed Reports</h3>
	          <p className="text-gray-600 leading-relaxed">Receive comprehensive reports with clear explanations of compliance issues and suggestions for correction.</p>
	        </div>
	        
	        <div className="group bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
	          <div className="p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
	            <span className="material-symbols-outlined text-pink-600 text-3xl">public</span>
	          </div>
	          <h3 className="text-2xl font-bold mb-4 text-gray-900">Multi-Market Support</h3>
	          <p className="text-gray-600 leading-relaxed">Target USA, UK, and German marketplaces with region-specific compliance checks and requirements.</p>
	        </div>
	      </div>
	    </div>
	  </section></div>
	    
	    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10"></div>
	  </header>
	
	  {/* Features Section */}
	  
	
	  {/* Marketplaces Section */}
	  <section id="marketplaces" className="py-24 bg-white">
	    <div className="container mx-auto px-6">
	      <div className="text-center mb-20">
	        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
	          <span className="material-symbols-outlined text-lg mr-2">public</span>
	          Global Reach
	        </div>
	        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
	          Supported Marketplaces
	        </h2>
	        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Ensure your products meet the specific requirements for each region with our comprehensive compliance coverage.</p>
	      </div>
	
	      <div className="grid md:grid-cols-3 gap-8">
	        <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
	          <div className="h-56 bg-gradient-to-br from-red-500 via-blue-600 to-indigo-700 relative overflow-hidden">
	            <div className="absolute inset-0 bg-black/20"></div>
	            <div className="absolute inset-0 flex items-center justify-center">
	              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
	                <img src="https://img.icons8.com/color/96/000000/usa-circular.png" alt="USA Flag" className="w-16 h-16" keywords="USA, America, flag" />
	              </div>
	            </div>
	            <div className="absolute bottom-4 left-4 right-4">
	              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
	                <h3 className="text-xl font-bold text-gray-900">United States</h3>
	              </div>
	            </div>
	          </div>
	          <div className="p-8">
	            <ul className="space-y-3 text-gray-700">
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="font-medium">FDA Regulations</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="font-medium">CPSC Requirements</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="font-medium">Amazon.com Specific Policies</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="font-medium">California Prop 65</span>
	              </li>
	            </ul>
	          </div>
	        </div>
	        
	        <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
	          <div className="h-56 bg-gradient-to-br from-blue-600 via-red-600 to-indigo-700 relative overflow-hidden">
	            <div className="absolute inset-0 bg-black/20"></div>
	            <div className="absolute inset-0 flex items-center justify-center">
	              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
	                <img src="https://img.icons8.com/color/96/000000/great-britain-circular.png" alt="UK Flag" className="w-16 h-16" keywords="UK, United Kingdom, flag" />
	              </div>
	            </div>
	            <div className="absolute bottom-4 left-4 right-4">
	              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
	                <h3 className="text-xl font-bold text-gray-900">United Kingdom</h3>
	              </div>
	            </div>
	          </div>
	          <div className="p-8">
	            <ul className="space-y-3 text-gray-700">
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="font-medium">UK Responsible Person Rules</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="font-medium">UKCA Marking Requirements</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="font-medium">Amazon.co.uk Specific Policies</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="font-medium">Post-Brexit Regulatory Changes</span>
	              </li>
	            </ul>
	          </div>
	        </div>
	        
	        <div className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
	          <div className="h-56 bg-gradient-to-br from-black via-red-600 to-yellow-500 relative overflow-hidden">
	            <div className="absolute inset-0 bg-black/20"></div>
	            <div className="absolute inset-0 flex items-center justify-center">
	              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
	                <img src="https://img.icons8.com/color/96/000000/germany-circular.png" alt="German Flag" className="w-16 h-16" keywords="Germany, Deutschland, flag" />
	              </div>
	            </div>
	            <div className="absolute bottom-4 left-4 right-4">
	              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
	                <h3 className="text-xl font-bold text-gray-900">Germany</h3>
	              </div>
	            </div>
	          </div>
	          <div className="p-8">
	            <ul className="space-y-3 text-gray-700">
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="font-medium">EU Product Regulations</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="font-medium">CE Marking Requirements</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="font-medium">Amazon.de Specific Policies</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="font-medium">German Language Requirements</span>
	              </li>
	            </ul>
	          </div>
	        </div>
	      </div>
	    </div>
	  </section>
	
	  {/* How It Works */}
	  <section id="process" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50">
	    <div className="container mx-auto px-6">
	      <div className="text-center mb-20">
	        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
	          <span className="material-symbols-outlined text-lg mr-2">timeline</span>
	          Simple Process
	        </div>
	        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
	          How It Works
	        </h2>
	        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Our simple 4-step process ensures your labels are compliant with all regulations using advanced AI technology.</p>
	      </div>
	
	      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
	        <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative border border-white/50">
	          <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300">1</div>
	          <div className="text-center pt-8">
	            <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
	              <span className="material-symbols-outlined text-5xl text-purple-600">upload_file</span>
	            </div>
	            <h3 className="text-2xl font-bold mb-4 text-gray-900">Upload Label</h3>
	            <p className="text-gray-600 leading-relaxed">Upload your product label as an image, PDF, or text document for analysis.</p>
	          </div>
	        </div>
	        
	        <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative border border-white/50">
	          <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300">2</div>
	          <div className="text-center pt-8">
	            <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
	              <span className="material-symbols-outlined text-5xl text-blue-600">manage_search</span>
	            </div>
	            <h3 className="text-2xl font-bold mb-4 text-gray-900">Select Parameters</h3>
	            <p className="text-gray-600 leading-relaxed">Choose product category, target marketplaces, and applicable regulations.</p>
	          </div>
	        </div>
	        
	        <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative border border-white/50">
	          <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300">3</div>
	          <div className="text-center pt-8">
	            <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
	              <span className="material-symbols-outlined text-5xl text-green-600">analytics</span>
	            </div>
	            <h3 className="text-2xl font-bold mb-4 text-gray-900">Automated Analysis</h3>
	            <p className="text-gray-600 leading-relaxed">Our system analyzes your label against selected regulatory requirements.</p>
	          </div>
	        </div>
	        
	        <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative border border-white/50">
	          <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300">4</div>
	          <div className="text-center pt-8">
	            <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
	              <span className="material-symbols-outlined text-5xl text-orange-600">assignment</span>
	            </div>
	            <h3 className="text-2xl font-bold mb-4 text-gray-900">Detailed Report</h3>
	            <p className="text-gray-600 leading-relaxed">Receive a comprehensive compliance report with specific recommendations.</p>
	          </div>
	        </div>
	      </div>
	      
	      <div className="mt-20 text-center">
	        <button className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 flex items-center justify-center mx-auto">
	          <span className="material-symbols-outlined mr-2 group-hover:rotate-12 transition-transform duration-300">rocket_launch</span>
	          Try It Now
	        </button>
	      </div>
	    </div>
	  </section>
	
	  {/* Upload Demo */}
	  <section className="py-24 bg-white">
	    <div className="container mx-auto px-6">
	      <div className="flex flex-col lg:flex-row items-center gap-16">
	        <div className="lg:w-1/2">
	          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-6">
	            <span className="material-symbols-outlined text-lg mr-2">cloud_upload</span>
	            Try It Free
	          </div>
	          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
	            Upload Your Label for Compliance Review
	          </h2>
	          <p className="text-xl text-gray-600 mb-10 leading-relaxed">Start with a free basic analysis of your product label. Ensure your products meet regulatory requirements before listing on Amazon.</p>
	          
	          <div className="group bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-2xl p-12 text-center transition-all duration-300 hover:shadow-xl">
	            <div className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
	              <span className="material-symbols-outlined text-6xl text-purple-500">cloud_upload</span>
	            </div>
	            <h3 className="text-2xl font-bold mb-4 text-gray-900">Drag & Drop Your Label File</h3>
	            <p className="text-gray-500 mb-8 text-lg">or</p>
	            <button className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25 flex items-center justify-center mx-auto">
	              <span className="material-symbols-outlined mr-2 group-hover:rotate-12 transition-transform duration-300">folder_open</span>
	              Browse Files
	            </button>
	            <p className="text-sm text-gray-500 mt-6 font-medium">Accepts JPG, PNG, PDF up to 10MB</p>
	          </div>
	        </div>
	        
	        <div className="lg:w-1/2 bg-gradient-to-br from-slate-50 to-blue-50 p-10 rounded-2xl shadow-xl border border-white/50">
	          <div className="flex items-center mb-8">
	            <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl mr-4">
	              <span className="material-symbols-outlined text-purple-600 text-2xl">assignment</span>
	            </div>
	            <h3 className="text-3xl font-bold text-gray-900">Sample Compliance Report</h3>
	          </div>
	          
	          <div className="space-y-6">
	            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl border-l-4 border-green-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
	              <div className="flex items-start">
	                <span className="material-symbols-outlined text-green-500 mr-3 text-2xl group-hover:scale-110 transition-transform duration-200">check_circle</span>
	                <div>
	                  <h4 className="font-bold text-lg text-gray-900 mb-2">Required Warning Statements</h4>
	                  <p className="text-gray-600 leading-relaxed">All mandatory warnings for toy products are present and correctly formatted.</p>
	                </div>
	              </div>
	            </div>
	            
	            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl border-l-4 border-red-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
	              <div className="flex items-start">
	                <span className="material-symbols-outlined text-red-500 mr-3 text-2xl group-hover:scale-110 transition-transform duration-200">error</span>
	                <div>
	                  <h4 className="font-bold text-lg text-gray-900 mb-2">CE/UKCA Marking</h4>
	                  <p className="text-gray-600 leading-relaxed">The UKCA mark is missing for UK marketplace compliance. This is required for all toys sold in the UK post-Brexit.</p>
	                </div>
	              </div>
	            </div>
	            
	            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl border-l-4 border-yellow-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
	              <div className="flex items-start">
	                <span className="material-symbols-outlined text-yellow-500 mr-3 text-2xl group-hover:scale-110 transition-transform duration-200">warning</span>
	                <div>
	                  <h4 className="font-bold text-lg text-gray-900 mb-2">Amazon Policy Requirements</h4>
	                  <p className="text-gray-600 leading-relaxed">Choking hazard warning present but not formatted according to Amazon policy. Recommended to adjust font size and placement.</p>
	                </div>
	              </div>
	            </div>
	            
	            <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl border-l-4 border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
	              <div className="flex items-start">
	                <span className="material-symbols-outlined text-blue-500 mr-3 text-2xl group-hover:scale-110 transition-transform duration-200">info</span>
	                <div>
	                  <h4 className="font-bold text-lg text-gray-900 mb-2">Recommendation</h4>
	                  <p className="text-gray-600 leading-relaxed">Add UK Responsible Person information and adjust warning format to comply with all requirements.</p>
	                </div>
	              </div>
	            </div>
	          </div>
	        </div>
	      </div>
	    </div>
	  </section>
	
	  {/* Pricing */}
	  <section id="pricing" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50">
	    <div className="container mx-auto px-6">
	      <div className="text-center mb-20">
	        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
	          <span className="material-symbols-outlined text-lg mr-2">payments</span>
	          Pricing
	        </div>
	        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
	          Simple Pricing Plans
	        </h2>
	        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Choose the plan that works best for your business needs with transparent, no-hidden-fees pricing.</p>
	      </div>
	
	      <div className="grid md:grid-cols-3 gap-8">
	        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
	          <div className="p-8 border-b border-gray-200/50">
	            <h3 className="text-3xl font-bold mb-3 text-gray-900">Basic</h3>
	            <p className="text-gray-600 mb-8 text-lg">For occasional sellers</p>
	            <div className="flex items-end mb-6">
	              <span className="text-5xl font-bold text-gray-900">$19</span>
	              <span className="text-gray-500 ml-3 text-lg">per label</span>
	            </div>
	          </div>
	          <div className="p-8">
	            <ul className="space-y-5 mb-8">
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="text-gray-700 font-medium">Single marketplace analysis</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="text-gray-700 font-medium">Basic compliance report</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="text-gray-700 font-medium">Issue identification</span>
	              </li>
	              <li className="flex items-start text-gray-400 group/item">
	                <span className="material-symbols-outlined mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">close</span>
	                <span className="font-medium">Multi-marketplace support</span>
	              </li>
	              <li className="flex items-start text-gray-400 group/item">
	                <span className="material-symbols-outlined mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">close</span>
	                <span className="font-medium">Detailed recommendations</span>
	              </li>
	            </ul>
	            <button className="group w-full py-4 bg-white border-2 border-purple-500 text-purple-600 rounded-full font-bold hover:bg-purple-50 transition-all duration-300 hover:scale-105 flex items-center justify-center">
	              <span className="material-symbols-outlined mr-2 group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
	              Choose Basic
	            </button>
	          </div>
	        </div>
	        
	        <div className="group bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl overflow-hidden transform hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 relative border-4 border-purple-200">
	          <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm shadow-lg">
	            <span className="material-symbols-outlined text-sm mr-1">star</span>
	            Popular
	          </div>
	          <div className="p-8 border-b border-white/20">
	            <h3 className="text-3xl font-bold mb-3 text-white">Professional</h3>
	            <p className="text-white/90 mb-8 text-lg">For regular sellers</p>
	            <div className="flex items-end mb-6">
	              <span className="text-5xl font-bold text-white">$49</span>
	              <span className="text-white/80 ml-3 text-lg">per month</span>
	            </div>
	          </div>
	          <div className="p-8 bg-white/5 backdrop-blur-sm">
	            <ul className="space-y-5 mb-8">
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-400 mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="text-white font-medium">10 labels per month</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-400 mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="text-white font-medium">Multi-marketplace analysis</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-400 mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="text-white font-medium">Detailed compliance report</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-400 mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="text-white font-medium">Specific recommendations</span>
	              </li>
	              <li className="flex items-start text-white/60 group/item">
	                <span className="material-symbols-outlined mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">close</span>
	                <span className="font-medium">Priority support</span>
	              </li>
	            </ul>
	            <button className="group w-full py-4 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center justify-center shadow-xl">
	              <span className="material-symbols-outlined mr-2 group-hover:translate-x-1 transition-transform duration-300">rocket_launch</span>
	              Choose Professional
	            </button>
	          </div>
	        </div>
	        
	        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
	          <div className="p-8 border-b border-gray-200/50">
	            <h3 className="text-3xl font-bold mb-3 text-gray-900">Enterprise</h3>
	            <p className="text-gray-600 mb-8 text-lg">For high-volume sellers</p>
	            <div className="flex items-end mb-6">
	              <span className="text-5xl font-bold text-gray-900">$199</span>
	              <span className="text-gray-500 ml-3 text-lg">per month</span>
	            </div>
	          </div>
	          <div className="p-8">
	            <ul className="space-y-5 mb-8">
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="text-gray-700 font-medium">Unlimited labels</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="text-gray-700 font-medium">All marketplace analysis</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="text-gray-700 font-medium">Expert compliance reports</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="text-gray-700 font-medium">Detailed recommendations</span>
	              </li>
	              <li className="flex items-start group/item">
	                <span className="material-symbols-outlined text-green-500 mr-3 text-xl group-hover/item:scale-110 transition-transform duration-200">check_circle</span>
	                <span className="text-gray-700 font-medium">Priority support</span>
	              </li>
	            </ul>
	            <button className="group w-full py-4 bg-white border-2 border-purple-500 text-purple-600 rounded-full font-bold hover:bg-purple-50 transition-all duration-300 hover:scale-105 flex items-center justify-center">
	              <span className="material-symbols-outlined mr-2 group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
	              Choose Enterprise
	            </button>
	          </div>
	        </div>
	      </div>
	    </div>
	  </section>
	
	  {/* Testimonials */}
	  <section className="py-24 bg-white">
	    <div className="container mx-auto px-6">
	      <div className="text-center mb-20">
	        <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold mb-6">
	          <span className="material-symbols-outlined text-lg mr-2">star</span>
	          Testimonials
	        </div>
	        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
	          What Our Clients Say
	        </h2>
	        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Hear from sellers who have improved their compliance with our tool and achieved better marketplace success.</p>
	      </div>
	
	      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
	        <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
	          <div className="flex items-center space-x-1 mb-6">
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	          </div>
	          <p className="text-gray-600 mb-8 italic text-lg leading-relaxed">"This tool saved our product from being delisted on Amazon. It caught compliance issues we completely overlooked in our toy packaging. Worth every penny!"</p>
	          <div className="flex items-center">
	            <div className="w-16 h-16 rounded-full overflow-hidden mr-4 ring-4 ring-purple-100 group-hover:ring-purple-200 transition-all duration-300">
	              <img src="https://images.unsplash.com/photo-1654723011673-86b0eae447a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbHxlbnwwfHx8fDE3NTk1MzA3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Client" className="w-full h-full object-cover" keywords="testimonial, user, client" />
	            </div>
	            <div>
	              <h4 className="font-bold text-lg text-gray-900">Sarah Johnson</h4>
	              <p className="text-sm text-gray-500 font-medium">Toy Seller, United States</p>
	            </div>
	          </div>
	        </div>
	        
	        <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
	          <div className="flex items-center space-x-1 mb-6">
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star_half</span>
	          </div>
	          <p className="text-gray-600 mb-8 italic text-lg leading-relaxed">"As a UK seller navigating post-Brexit regulations, this tool has been invaluable. It helped us correctly implement UKCA markings and Responsible Person details."</p>
	          <div className="flex items-center">
	            <div className="w-16 h-16 rounded-full overflow-hidden mr-4 ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
	              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbHxlbnwwfHx8fDE3NTk1MzA3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Client" className="w-full h-full object-cover" keywords="testimonial, user, client" />
	            </div>
	            <div>
	              <h4 className="font-bold text-lg text-gray-900">Michael Chen</h4>
	              <p className="text-sm text-gray-500 font-medium">E-commerce Manager, United Kingdom</p>
	            </div>
	          </div>
	        </div>
	        
	        <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
	          <div className="flex items-center space-x-1 mb-6">
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	            <span className="material-symbols-outlined text-yellow-400 text-xl">star</span>
	          </div>
	          <p className="text-gray-600 mb-8 italic text-lg leading-relaxed">"The detailed reports and recommendations have transformed our compliance process. We've reduced listing rejections by 90% since using this tool."</p>
	          <div className="flex items-center">
	            <div className="w-16 h-16 rounded-full overflow-hidden mr-4 ring-4 ring-green-100 group-hover:ring-green-200 transition-all duration-300">
	              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHx0ZXN0aW1vbmlhbHxlbnwwfHx8fDE3NTk1MzA3NzB8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Client" className="w-full h-full object-cover" keywords="testimonial, user, client" />
	            </div>
	            <div>
	              <h4 className="font-bold text-lg text-gray-900">Emma Rodriguez</h4>
	              <p className="text-sm text-gray-500 font-medium">Product Manager, Germany</p>
	            </div>
	          </div>
	        </div>
	      </div>
	    </div>
	  </section>
	</div> 
        </div>
  )
}

