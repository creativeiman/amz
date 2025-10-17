"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { LoadingPage } from "@/components/loading"
import { Save } from "lucide-react"
import { MarkdownEditor } from "@/components/markdown-editor"

type Settings = {
  masterPrompt: string
  commonRules: string
  usRules: string
  ukRules: string
  euRules: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<Settings>({
    masterPrompt: "",
    commonRules: "",
    usRules: "",
    ukRules: "",
    euRules: "",
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)

  // Fetch settings
  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/admin/api/settings")
        if (!response.ok) throw new Error("Failed to fetch settings")
        const data = await response.json()
        setSettings(data.settings || settings)
      } catch (error) {
        console.error("Error fetching settings:", error)
        toast.error("Failed to load settings")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/admin/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error("Failed to save settings")

      toast.success("Settings saved successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <LoadingPage text="Loading settings..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure AI prompts and compliance rules for label analysis
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save All"}
        </Button>
      </div>

      <Tabs defaultValue="prompt" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="prompt">Master Prompt</TabsTrigger>
          <TabsTrigger value="common">Common Rules</TabsTrigger>
          <TabsTrigger value="us">US Rules</TabsTrigger>
          <TabsTrigger value="uk">UK Rules</TabsTrigger>
          <TabsTrigger value="eu">EU Rules</TabsTrigger>
        </TabsList>

        {/* Master Prompt Tab */}
        <TabsContent value="prompt">
          <Card>
            <CardHeader>
              <CardTitle>Master Prompt</CardTitle>
              <CardDescription>
                The main AI prompt used to analyze product labels. This prompt instructs Claude on how to analyze
                labels for compliance. You can customize this to focus on specific aspects or add custom instructions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 mb-4">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">💡 How It Works</p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  This master prompt is automatically enhanced with dynamic context including:
                </p>
                <ul className="text-sm text-blue-600 dark:text-blue-400 mt-2 ml-4 space-y-1">
                  <li>• Product category information</li>
                  <li>• Target marketplace regulations</li>
                  <li>• Applicable compliance rules (Common + Country-specific)</li>
                </ul>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  The AI will analyze labels using this prompt combined with the relevant rules from the tabs below.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="masterPrompt">AI Analysis Prompt</Label>
                <MarkdownEditor
                  value={settings.masterPrompt}
                  onChange={(value) => setSettings({ ...settings, masterPrompt: value })}
                  placeholder="Enter the master prompt for AI label analysis..."
                  minHeight="500px"
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to use the default prompt. The system will automatically append category, marketplace, and rule information.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Common Rules Tab */}
        <TabsContent value="common">
          <Card>
            <CardHeader>
              <CardTitle>Common Compliance Rules</CardTitle>
              <CardDescription>
                General compliance rules that apply to all countries/regions. These rules will be included in every
                analysis regardless of the target marketplace. Use Markdown format for better readability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commonRules">Common Rules (Markdown)</Label>
                <MarkdownEditor
                  value={settings.commonRules}
                  onChange={(value) => setSettings({ ...settings, commonRules: value })}
                  placeholder="# General Product Safety

## Labeling Requirements
- Product name must be clearly visible
- Manufacturer information required

## Safety Standards
- All products must meet basic safety requirements..."
                  minHeight="500px"
                />
                <p className="text-sm text-muted-foreground">
                  Markdown formatting supported: headings, lists, bold, italic, links, etc.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* US Rules Tab */}
        <TabsContent value="us">
          <Card>
            <CardHeader>
              <CardTitle>United States Compliance Rules</CardTitle>
              <CardDescription>
                US-specific compliance rules including FDA, CPSC, CPSIA, and state-specific requirements.
                These rules will be included when analyzing labels for the US marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="usRules">US Rules (Markdown)</Label>
                <MarkdownEditor
                  value={settings.usRules}
                  onChange={(value) => setSettings({ ...settings, usRules: value })}
                  placeholder="# United States Regulations

## FDA Requirements (Cosmetics)
- INCI ingredient listing required
- Net contents declaration...

## CPSC/CPSIA (Toys & Children's Products)
- Lead content limits
- Tracking labels required..."
                  minHeight="500px"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UK Rules Tab */}
        <TabsContent value="uk">
          <Card>
            <CardHeader>
              <CardTitle>United Kingdom Compliance Rules</CardTitle>
              <CardDescription>
                UK-specific compliance rules including UKCA marking, UK CA requirements, and BS EN standards.
                These rules will be included when analyzing labels for the UK marketplace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ukRules">UK Rules (Markdown)</Label>
                <MarkdownEditor
                  value={settings.ukRules}
                  onChange={(value) => setSettings({ ...settings, ukRules: value })}
                  placeholder="# United Kingdom Regulations

## UKCA Marking
- Required for certain products...

## BS EN Standards
- BS EN 71 for toys...

## UK Cosmetics Regulation
- Ingredient disclosure..."
                  minHeight="500px"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EU Rules Tab */}
        <TabsContent value="eu">
          <Card>
            <CardHeader>
              <CardTitle>European Union (Germany) Compliance Rules</CardTitle>
              <CardDescription>
                EU/Germany-specific compliance rules including CE marking, EN standards, and EU regulations.
                These rules will be included when analyzing labels for EU/German marketplaces.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="euRules">EU/Germany Rules (Markdown)</Label>
                <MarkdownEditor
                  value={settings.euRules}
                  onChange={(value) => setSettings({ ...settings, euRules: value })}
                  placeholder="# European Union Regulations

## CE Marking
- Mandatory for many product categories...

## EN Standards
- EN 71 for toys...

## EU Cosmetics Regulation 1223/2009
- Full ingredient disclosure..."
                  minHeight="500px"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
