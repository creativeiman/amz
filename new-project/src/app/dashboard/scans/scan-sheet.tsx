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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, X, FileImage } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

const scanSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.enum(["TOYS", "BABY_PRODUCTS", "COSMETICS_PERSONAL_CARE"]),
  marketplaces: z.string().min(1, "Select a marketplace"),
  labelFile: z.any().optional(),
})

type ScanFormData = z.infer<typeof scanSchema>

interface ScanSheetProps {
  scan: Scan | null
  isOpen: boolean
  onClose: () => void
  onSave: (formData: FormData) => Promise<void>
}

// Category labels moved to translation function

const statusColors = {
  QUEUED: "bg-gray-500/10 text-gray-500 dark:bg-gray-500/20 dark:text-gray-400",
  PROCESSING: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400",
  COMPLETED: "bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400",
  FAILED: "bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400",
}

const riskColors = {
  LOW: "bg-green-500/10 text-green-500",
  MEDIUM: "bg-yellow-500/10 text-yellow-500",
  HIGH: "bg-red-500/10 text-red-500",
  CRITICAL: "bg-red-700/10 text-red-700",
}

const marketplaceOptions = [
  { id: "US", flag: "🇺🇸" },
  { id: "UK", flag: "🇬🇧" },
  { id: "DE", flag: "🇩🇪" },
]

export function ScanSheet({ scan, isOpen, onClose, onSave }: ScanSheetProps) {
  const { t } = useTranslation('dashboard-scans')
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
      marketplaces: "",
    },
  })

  // Reset form when scan changes (view mode)
  React.useEffect(() => {
    if (scan) {
      reset({
        productName: scan.productName,
        category: scan.category,
        marketplaces: Array.isArray(scan.marketplaces) ? scan.marketplaces[0] || "" : scan.marketplaces,
      })
      setSelectedFile(null)
      setFilePreview(null)
    } else {
      reset({
        productName: "",
        category: "TOYS",
        marketplaces: "",
      })
      setSelectedFile(null)
      setFilePreview(null)
    }
  }, [scan, reset])

  const category = watch("category")
  const marketplaces = watch("marketplaces") || ""

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

  const onSubmit = async (data: ScanFormData) => {
    if (!scan && !selectedFile) {
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("productName", data.productName)
      formData.append("category", data.category)
      formData.append("marketplaces", JSON.stringify([data.marketplaces]))
      
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

  const getCategoryLabel = (category: string) => {
    return t(`category.${category.toLowerCase()}`, category)
  }

  const getMarketplaceName = (id: string) => {
    return t(`marketplace.${id.toLowerCase()}`, id)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[640px] flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isViewMode ? t('sheet.viewTitle', 'Scan Details') : t('sheet.newTitle', 'New Label Scan')}</SheetTitle>
          <SheetDescription>
            {isViewMode
              ? t('sheet.viewDescription', 'View scan details and compliance results.')
              : t('sheet.newDescription', 'Upload a product label image for compliance analysis.')}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
          <div className="flex-1 space-y-6 p-6 pt-4">
            {/* View Mode - Show scan status and results */}
            {isViewMode && scan && (
              <div className="space-y-4 pb-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-xs">{t('sheet.status', 'Status')}</Label>
                    <Badge variant="outline" className={statusColors[scan.status]}>
                      {t(`status.${scan.status.toLowerCase()}`, scan.status)}
                    </Badge>
                  </div>
                  {scan.score !== null && (
                    <div className="flex-1">
                      <Label className="text-muted-foreground text-xs">{t('sheet.complianceScore', 'Compliance Score')}</Label>
                      <div className="text-2xl font-bold">{scan.score}%</div>
                    </div>
                  )}
                  {scan.riskLevel && (
                    <div className="flex-1">
                      <Label className="text-muted-foreground text-xs">{t('sheet.riskLevel', 'Risk Level')}</Label>
                      <Badge variant="outline" className={riskColors[scan.riskLevel]}>
                        {t(`risk.${scan.riskLevel.toLowerCase()}`, scan.riskLevel)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* File Upload (Create Mode Only) */}
            {!isViewMode && (
              <div className="space-y-2">
                <Label>{t('sheet.uploadLabel', 'Upload Label File')} *</Label>
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
                        <p className="font-medium">{t('sheet.dragDrop', 'Drag and drop your label here')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('sheet.browseFiles', 'or click to browse files (JPG, PNG, PDF)')}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {t('sheet.chooseFile', 'Choose File')}
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
              <Label htmlFor="productName">{t('sheet.productName', 'Product Name')} *</Label>
              <Input
                id="productName"
                {...register("productName")}
                placeholder={t('sheet.productNamePlaceholder', 'Enter product name')}
                disabled={isViewMode}
              />
              {errors.productName && (
                <p className="text-sm text-red-600">{errors.productName.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">{t('sheet.category', 'Category')} *</Label>
              <Select
                value={category}
                onValueChange={(value) =>
                  setValue("category", value as "TOYS" | "BABY_PRODUCTS" | "COSMETICS_PERSONAL_CARE")
                }
                disabled={isViewMode}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('sheet.selectCategory', 'Select a category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOYS">{getCategoryLabel('TOYS')}</SelectItem>
                  <SelectItem value="BABY_PRODUCTS">{getCategoryLabel('BABY_PRODUCTS')}</SelectItem>
                  <SelectItem value="COSMETICS_PERSONAL_CARE">
                    {getCategoryLabel('COSMETICS_PERSONAL_CARE')}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Target Marketplace */}
            <div className="space-y-3">
              <Label>{t('sheet.targetMarketplace', 'Target Marketplace')} *</Label>
              <RadioGroup
                value={marketplaces}
                onValueChange={(value) => setValue("marketplaces", value)}
                disabled={isViewMode}
              >
                <div className="space-y-2">
                  {marketplaceOptions.map((marketplace) => (
                    <div key={marketplace.id} className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={marketplace.id}
                        id={marketplace.id}
                        disabled={isViewMode}
                      />
                      <Label
                        htmlFor={marketplace.id}
                        className="flex items-center gap-2 cursor-pointer font-normal"
                      >
                        <span className="text-xl">{marketplace.flag}</span>
                        {getMarketplaceName(marketplace.id)}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
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
              {isViewMode ? t('sheet.close', 'Close') : t('sheet.cancel', 'Cancel')}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={isSubmitting || !selectedFile} className="flex-1">
                {isSubmitting ? t('sheet.scanning', 'Scanning...') : t('sheet.scanLabel', 'Scan Label')}
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
