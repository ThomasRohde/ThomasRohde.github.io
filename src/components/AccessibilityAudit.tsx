import { useEffect, useState, useCallback } from 'react';
import {
  useAccessibilityChecker,
  type AccessibilityIssue,
} from '@/lib/accessibility';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AccessibilityAuditProps {
  autoRun?: boolean;
  showReport?: boolean;
}

export default function AccessibilityAudit({
  autoRun = false,
  showReport = false,
}: AccessibilityAuditProps) {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const { checkPage, generateReport } = useAccessibilityChecker();

  const runAudit = useCallback(async () => {
    setIsRunning(true);
    try {
      // Small delay to ensure DOM is ready
      await new Promise((resolve) => setTimeout(resolve, 100));
      const foundIssues = checkPage();
      setIssues(foundIssues);
      setHasRun(true);

      if (process.env.NODE_ENV === 'development') {
        console.log('Accessibility Audit Results:', foundIssues);
        console.log(generateReport());
      }
    } catch (error) {
      console.error('Accessibility audit failed:', error);
    } finally {
      setIsRunning(false);
    }
  }, [checkPage, generateReport]);

  useEffect(() => {
    if (autoRun) {
      // Run audit after component mounts and DOM is ready
      const timer = setTimeout(runAudit, 500);
      return () => clearTimeout(timer);
    }
  }, [autoRun, runAudit]);

  const getSeverityIcon = (severity: AccessibilityIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'serious':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'moderate':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'minor':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: AccessibilityIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'serious':
        return 'destructive';
      case 'moderate':
        return 'secondary';
      case 'minor':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const criticalIssues = issues.filter((i) => i.severity === 'critical');
  const seriousIssues = issues.filter((i) => i.severity === 'serious');
  const moderateIssues = issues.filter((i) => i.severity === 'moderate');
  const minorIssues = issues.filter((i) => i.severity === 'minor');

  if (!showReport && process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Accessibility Audit
            </CardTitle>
            <CardDescription>
              Automated accessibility testing results
            </CardDescription>
          </div>
          <Button
            onClick={runAudit}
            disabled={isRunning}
            variant="outline"
            size="sm"
          >
            {isRunning ? 'Running...' : 'Run Audit'}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {!hasRun && !isRunning && (
          <div className="text-muted-foreground py-8 text-center">
            Click "Run Audit" to check accessibility compliance
          </div>
        )}

        {isRunning && (
          <div className="py-8 text-center">
            <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <p className="text-muted-foreground">
              Running accessibility audit...
            </p>
          </div>
        )}

        {hasRun && !isRunning && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {criticalIssues.length}
                </div>
                <div className="text-muted-foreground text-sm">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {seriousIssues.length}
                </div>
                <div className="text-muted-foreground text-sm">Serious</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {moderateIssues.length}
                </div>
                <div className="text-muted-foreground text-sm">Moderate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {minorIssues.length}
                </div>
                <div className="text-muted-foreground text-sm">Minor</div>
              </div>
            </div>

            {/* Overall Status */}
            <div className="text-center">
              {issues.length === 0 ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    No accessibility issues found!
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">
                    {issues.length} accessibility issue
                    {issues.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              )}
            </div>

            {/* Issues List */}
            {issues.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Issues Found</h3>
                <div className="space-y-3">
                  {issues.map((issue, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border p-4"
                    >
                      {getSeverityIcon(issue.severity)}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <Badge variant={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                          <Badge variant="outline">{issue.rule}</Badge>
                        </div>
                        <p className="text-foreground text-sm font-medium">
                          {issue.message}
                        </p>
                        {issue.element && (
                          <p className="text-muted-foreground mt-1 text-xs">
                            Element: {issue.element.tagName.toLowerCase()}
                            {issue.element.className &&
                              ` .${issue.element.className}`}
                            {issue.element.id && ` #${issue.element.id}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {issues.length > 0 && (
              <div className="bg-muted rounded-lg p-4">
                <h4 className="mb-2 font-medium">Recommendations</h4>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Fix critical and serious issues first</li>
                  <li>• Test with screen readers and keyboard navigation</li>
                  <li>• Verify color contrast meets WCAG guidelines</li>
                  <li>• Ensure all interactive elements are focusable</li>
                  <li>• Add proper ARIA labels and descriptions</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
