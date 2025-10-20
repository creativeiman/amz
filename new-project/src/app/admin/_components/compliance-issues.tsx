import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb } from "lucide-react"

interface ComplianceIssuesProps {
  issues: Array<{
    issue: string
    count: number
    criticality: 'High' | 'Medium'
  }>
}

export function ComplianceIssues({ issues }: ComplianceIssuesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Common Compliance Issues</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {issues.length > 0 ? (
            issues.map((issue, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center flex-1">
                  <span className="text-sm font-medium text-muted-foreground mr-2">{index + 1}.</span>
                  <span className="text-sm">{issue.issue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={issue.criticality === 'High' ? 'destructive' : 'secondary'}
                  >
                    {issue.criticality}
                  </Badge>
                  <span className="text-sm font-bold min-w-[60px] text-right">
                    {issue.count} times
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No compliance issues found
            </p>
          )}
        </div>
        {issues.length > 0 && (
          <Alert className="mt-4">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Action Item:</strong> Create content/guides about top 3 issues to reduce recurring problems and improve user satisfaction.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

