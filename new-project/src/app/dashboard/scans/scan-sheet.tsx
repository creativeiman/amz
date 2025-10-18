"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Scan } from "./columns"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, FileImage } from "lucide-react"

const scanSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.enum(["TOYS", "BABY_PRODUCTS", "COSMETICS_PERSONAL_CARE"]),
  marketplaces: z.array(z.string()).min(1, "Select at least one marketplace"),
  labelFile: z.any().optional(),
})

type ScanFormData = z.infer<typeof scanSchema>

interface ScanSheetProps {
  scan: Scan | null
  isOpen: boolean
  onClose: () => void
  onSave: (formData: FormData) => Promise<void>
}

const categoryLabels = {
  TOYS: "Toys",
  BABY_PRODUCTS: "Baby Products",
  COSMETICS_PERSONAL_CARE: "Cosmetics/Personal Care",
}

const statusColors = {
  QUEUED: "bg-gray-500/10 text-gray-500",
  PROCESSING: "bg-blue-500/10 text-blue-500",
  COMPLETED: "bg-green-500/10 text-green-500",
  FAILED: "bg-red-500/10 text-red-500",
}

const riskColors = {
  LOW: "bg-green-500/10 text-green-500",
  MEDIUM: "bg-yellow-500/10 text-yellow-500",
  HIGH: "bg-red-500/10 text-red-500",
  CRITICAL: "bg-red-700/10 text-red-700",
}

const marketplaceOptions = [
  { id: "US", name: "United States", flag: "🇺🇸" },
  { id: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { id: "DE", name: "Germany", flag: "🇩🇪" },
]

export function ScanSheet({ scan, isOpen, onClose, onSave }: ScanSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [filePreview, setFilePreview] = React.useState<string | null>(null)
  const [dragActive, setDragActive] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScanFormData>({
    resolver: zodResolver(scanSchema),
    defaultValues: {
      productName: "",
      category: "TOYS",
      marketplaces: [],
    },
  })

  // Reset form when scan changes (view mode)
  React.useEffect(() => {
    if (scan) {
      reset({
        productName: scan.productName,
        category: scan.category,
        marketplaces: scan.marketplaces,
      })
      setSelectedFile(null)
      setFilePreview(null)
    } else {
      reset({
        productName: "",
        category: "TOYS",
        marketplaces: [],
      })
      setSelectedFile(null)
      setFilePreview(null)
    }
  }, [scan, reset])

  const category = watch("category")
  const marketplaces = watch("marketplaces") || []

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      return
    }
    
    setSelectedFile(file)
    
    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleMarketplaceToggle = (marketplaceId: string) => {
    const current = marketplaces
    const updated = current.includes(marketplaceId)
      ? current.filter((id) => id !== marketplaceId)
      : [...current, marketplaceId]
    setValue("marketplaces", updated)
  }

  const onSubmit = async (data: ScanFormData) => {
    if (!scan && !selectedFile) {
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("productName", data.productName)
      formData.append("category", data.category)
      formData.append("marketplaces", JSON.stringify(data.marketplaces))
      
      if (selectedFile) {
        formData.append("labelFile", selectedFile)
      }

      await onSave(formData)
      onClose()
      reset()
      setSelectedFile(null)
      setFilePreview(null)
    } catch (error) {
      console.error("Error saving scan:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isViewMode = !!scan

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[640px] flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isViewMode ? "Scan Details" : "New Label Scan"}</SheetTitle>
          <SheetDescription>
            {isViewMode
              ? "View scan details and compliance results."
              : "Upload a product label image for compliance analysis."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
          <div className="flex-1 space-y-6 p-6 pt-4">
            {/* View Mode - Show scan status and results */}
            {isViewMode && scan && (
              <div className="space-y-4 pb-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-xs">Status</Label>
                    <Badge variant="outline" className={statusColors[scan.status]}>
                      {scan.status}
                    </Badge>
                  </div>
                  {scan.score !== null && (
                    <div className="flex-1">
                      <Label className="text-muted-foreground text-xs">Compliance Score</Label>
                      <div className="text-2xl font-bold">{scan.score}%</div>
                    </div>
                  )}
                  {scan.riskLevel && (
                    <div className="flex-1">
                      <Label className="text-muted-foreground text-xs">Risk Level</Label>
                      <Badge variant="outline" className={riskColors[scan.riskLevel]}>
                        {scan.riskLevel}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* File Upload (Create Mode Only) */}
            {!isViewMode && (
              <div className="space-y-2">
                <Label>Upload Label File *</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="space-y-4">
                      {filePreview ? (
                        <div className="relative max-w-sm mx-auto">
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="w-full h-auto rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setSelectedFile(null)
                              setFilePreview(null)
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ""
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3 p-4 bg-muted rounded-lg">
                          <FileImage className="h-8 w-8 text-muted-foreground" />
                          <div className="text-left">
                            <div className="font-medium">{selectedFile.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedFile(null)
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ""
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Drag and drop your label here</p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse files (JPG, PNG, PDF)
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
                {errors.labelFile?.message && (
                  <p className="text-sm text-red-600">{String(errors.labelFile.message)}</p>
                )}
              </div>
            )}

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                {...register("productName")}
                placeholder="Enter product name"
                disabled={isViewMode}
              />
              {errors.productName && (
                <p className="text-sm text-red-600">{errors.productName.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={category}
                onValueChange={(value) =>
                  setValue("category", value as "TOYS" | "BABY_PRODUCTS" | "COSMETICS_PERSONAL_CARE")
                }
                disabled={isViewMode}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOYS">{categoryLabels.TOYS}</SelectItem>
                  <SelectItem value="BABY_PRODUCTS">{categoryLabels.BABY_PRODUCTS}</SelectItem>
                  <SelectItem value="COSMETICS_PERSONAL_CARE">
                    {categoryLabels.COSMETICS_PERSONAL_CARE}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Target Marketplaces */}
            <div className="space-y-3">
              <Label>Target Marketplaces *</Label>
              <div className="space-y-2">
                {marketplaceOptions.map((marketplace) => (
                  <div key={marketplace.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={marketplace.id}
                      checked={marketplaces.includes(marketplace.id)}
                      onCheckedChange={() => handleMarketplaceToggle(marketplace.id)}
                      disabled={isViewMode}
                    />
                    <Label
                      htmlFor={marketplace.id}
                      className="flex items-center gap-2 cursor-pointer font-normal"
                    >
                      <span className="text-xl">{marketplace.flag}</span>
                      {marketplace.name}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.marketplaces && (
                <p className="text-sm text-red-600">{errors.marketplaces.message}</p>
              )}
            </div>
          </div>

          <SheetFooter className="flex-shrink-0 border-t pt-6 gap-2 px-6 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose()
                if (!isViewMode) {
                  reset()
                  setSelectedFile(null)
                  setFilePreview(null)
                }
              }}
              className="flex-1"
            >
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={isSubmitting || !selectedFile} className="flex-1">
                {isSubmitting ? "Scanning..." : "Scan Label"}
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
