'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Power, Target, Waves, ShieldCheck, ShieldOff, KeyRound, MessageSquareCode, Eye, EyeOff, PowerOff, Crosshair, Droplets, SprayCan, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

type PendingAction = 'toggleSystem' | 'togglePower' | null;

const MAX_WATER_LITERS = 5000;
const MAX_FOAM_LITERS = 1000;

interface SystemLogEntry {
    time: string;
    message: string;
}

export function SuppressionControls() {
  const { toast } = useToast();
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [pendingState, setPendingState] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [waterReserve, setWaterReserve] = useState(100);
  const [foamReserve, setFoamReserve] = useState(100);
  const [systemLog, setSystemLog] = useState<SystemLogEntry[]>([]);


  const addLogEntry = (message: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setSystemLog(prev => [{ time, message }, ...prev]);
  };

  const handleOverride = (gun: string, pressure: string, waterUsage: number, foamUsage: number) => {
    if (!isSystemActive) {
      toast({
        title: 'System Disabled',
        description: 'Cannot activate suppression system while it is turned off.',
        variant: 'destructive',
      });
      return;
    }
    
    let resourceUsedMessage = '';
    
    if (waterUsage > 0) {
        if(waterReserve > 0) {
            setWaterReserve(prev => Math.max(0, prev - (waterUsage / MAX_WATER_LITERS * 100)));
            resourceUsedMessage = `${waterUsage}L Water Used.`;
        } else {
            toast({ title: 'Water Depleted', description: 'Water reserve is empty.', variant: 'destructive' });
            return;
        }
    }
    
    if (foamUsage > 0) {
        if(foamReserve > 0) {
            setFoamReserve(prev => Math.max(0, prev - (foamUsage / MAX_FOAM_LITERS * 100)));
            resourceUsedMessage = `${foamUsage}L Foam Used.`;
        } else {
            toast({ title: 'Foam Depleted', description: 'Foam reserve is empty.', variant: 'destructive' });
            return;
        }
    }

    const logMessage = `${gun} activated at ${pressure}. ${resourceUsedMessage}`;
    addLogEntry(logMessage);

    toast({
      title: 'Suppression System Override',
      description: `Manually activating ${gun}.`,
    });
    
    if (isPowerOn) {
        setIsPowerOn(false);
        addLogEntry('Auto Power-Cut Protocol initiated due to suppression activation.');
        toast({
            title: "Auto Power-Cut Activated",
            description: "Non-essential power has been automatically cut.",
            variant: "destructive"
        });
    }
  };

  const handleToggleSystem = (checked: boolean) => {
    setPendingState(checked);
    setPendingAction('toggleSystem');
    setShowPasswordDialog(true);
  };
  
  const handleTogglePower = (on: boolean) => {
    setPendingState(on);
    setPendingAction('togglePower');
    setShowPasswordDialog(true);
  }

  const handlePasswordSubmit = () => {
    // In a real app, you'd verify the password against a backend.
    if (password === '1234') {
      setPasswordError('');
      setShowPasswordDialog(false);
      setShowOtpDialog(true);
      setPassword('');
      setShowPassword(false);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleOtpSubmit = () => {
    // In a real app, you'd verify the OTP against a backend.
    if (otp === '12345') {
      setOtpError('');
      setShowOtpDialog(false);
      setOtp('');

      if (pendingAction === 'toggleSystem') {
        setIsSystemActive(pendingState);
        const actionText = `System has been ${pendingState ? 'activated' : 'deactivated'}`;
        addLogEntry(actionText);
        toast({
          title: actionText,
          description: `The suppression system is now ${pendingState ? 'online' : 'offline'}.`,
          variant: pendingState ? 'default' : 'destructive',
        });
      } else if (pendingAction === 'togglePower') {
        setIsPowerOn(pendingState);
        const actionText = `Non-essential power ${pendingState ? 'restored' : 'cut'}`;
        addLogEntry(actionText);
         toast({
          title: `Power has been turned ${pendingState ? 'ON' : 'OFF'}`,
          description: `Non-essential power is now ${pendingState ? 'active' : 'inactive'}.`,
          variant: pendingState ? 'default' : 'destructive',
        });
      }
      setPendingAction(null);

    } else {
      setOtpError('Incorrect OTP. Please try again.');
    }
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Suppression System Controls</CardTitle>
                <CardDescription>Manual override and system status.</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
                {isSystemActive ? <ShieldCheck className="w-6 h-6 text-green-500" /> : <ShieldOff className="w-6 h-6 text-destructive" />}
                <Switch
                    checked={isSystemActive}
                    onCheckedChange={handleToggleSystem}
                    aria-label="Toggle Suppression System"
                />
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" size="lg" className="h-20 flex-col gap-2" onClick={() => handleOverride('Water Sprinklers', '150 PSI', 500, 0)} disabled={!isSystemActive || !isPowerOn}>
              <Waves className="w-6 h-6" />
              <span>Water Sprinklers</span>
            </Button>
            <Button variant="outline" size="lg" className="h-20 flex-col gap-2" onClick={() => handleOverride('Foam Concentrate', '200 PSI', 0, 200)} disabled={!isSystemActive || !isPowerOn}>
              <SprayCan className="w-6 h-6" />
              <span>Foam Concentrate</span>
            </Button>
            <Button size="lg" className="h-20 flex-col gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleOverride('Inferno Gun', '300 PSI', 100, 100)} disabled={!isSystemActive || !isPowerOn}>
              <Target className="w-6 h-6" />
              <span>Inferno Gun</span>
            </Button>
          </div>
           <Separator />
            <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="text-md font-semibold mb-3">Resource Levels</h4>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <div className="flex justify-between items-center text-sm">
                                <Label className="flex items-center gap-2 text-muted-foreground"><Droplets className="w-4 h-4"/> Water Reserve</Label>
                                <span className="font-semibold">{(MAX_WATER_LITERS * (waterReserve / 100)).toLocaleString()} / {MAX_WATER_LITERS.toLocaleString()} L</span>
                            </div>
                            <Progress value={waterReserve} />
                        </div>
                         <div className="grid gap-2">
                             <div className="flex justify-between items-center text-sm">
                                <Label className="flex items-center gap-2 text-muted-foreground"><SprayCan className="w-4 h-4"/> Foam Concentrate</Label>
                                <span className="font-semibold">{(MAX_FOAM_LITERS * (foamReserve / 100)).toLocaleString()} / {MAX_FOAM_LITERS.toLocaleString()} L</span>
                            </div>
                            <Progress value={foamReserve} />
                        </div>
                    </div>
                </div>
                 <div>
                    <h4 className="text-md font-semibold mb-3 flex items-center gap-2"><FileText className="w-4 h-4"/> System Log</h4>
                     <ScrollArea className="h-24 w-full rounded-md border p-2 bg-secondary/50">
                        <div className="space-y-2 pr-2">
                            {systemLog.length > 0 ? (
                                systemLog.map((entry, index) => (
                                    <div key={index} className="text-xs text-muted-foreground">
                                        <span className="font-mono mr-2">{entry.time}</span>
                                        <span>{entry.message}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-muted-foreground text-center pt-8">No actions taken yet.</div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
          <Separator />
           {isPowerOn ? (
              <Button variant="destructive" size="lg" className="w-full h-16" onClick={() => handleTogglePower(false)}>
                  <PowerOff className="w-6 h-6 mr-2" />
                  <span>Total Power Off (Non-Essentials)</span>
              </Button>
          ) : (
              <Button variant="secondary" size="lg" className="w-full h-16" onClick={() => handleTogglePower(true)}>
                  <Power className="w-6 h-6 mr-2" />
                  <span>Restore Power</span>
              </Button>
          )}
        </CardContent>
      </Card>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={(open) => {
        if (!open) {
          setShowPasswordDialog(false);
          setPassword('');
          setPasswordError('');
          setShowPassword(false);
        }
      }}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Admin Authentication Required</DialogTitle>
                <DialogDescription>
                    Please enter your password to change the system status. This action is logged.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <div className="flex items-center">
                        <KeyRound className="absolute left-3 w-5 h-5 text-muted-foreground" />
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          placeholder="Enter admin password"
                          className="pl-10" 
                        />
                         <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                        </Button>
                    </div>
                </div>
                {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
                <Button onClick={handlePasswordSubmit}>Continue</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* OTP Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={(open) => {
        if (!open) {
          setShowOtpDialog(false);
          setOtp('');
          setOtpError('');
        }
      }}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Two-Factor Authentication</DialogTitle>
                <DialogDescription>
                    Enter the one-time password sent to your registered device.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                 <div className="flex items-center space-x-2">
                    <MessageSquareCode className="w-5 h-5 text-muted-foreground" />
                    <Input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" />
                </div>
                {otpError && <p className="text-sm text-destructive">{otpError}</p>}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowOtpDialog(false)}>Cancel</Button>
                <Button onClick={handleOtpSubmit}>Confirm</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
