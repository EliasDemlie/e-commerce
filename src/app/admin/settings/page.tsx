'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button2'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useNotificationContext } from '@/provider/NotificationProvider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'E-commerce Store',
      siteDescription: 'Your one-stop shop for everything',
      contactEmail: 'admin@store.com',
      supportPhone: '+1-555-0123',
      timezone: 'UTC',
      currency: 'USD',
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      inventoryAlerts: true,
      customerNotifications: false,
      marketingEmails: true,
    },
    shipping: {
      freeShippingThreshold: 50,
      standardShippingRate: 5.99,
      expressShippingRate: 12.99,
      internationalShipping: false,
      processingTime: '1-2 business days',
    },
    payments: {
      acceptCreditCards: true,
      acceptPaypal: true,
      acceptCrypto: false,
      taxRate: 8.5,
      processingFee: 2.9,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: '',
    },
  })

  const { addNotification } = useNotificationContext()

  const handleSaveSettings = (section: string) => {
    addNotification({
      title: 'Settings Saved',
      message: `${section} settings have been updated successfully`,
      type: 'system',
    })
  }

  type Settings = typeof settings
  type SectionKeys = keyof Settings
  type FieldValue<
    T extends SectionKeys,
    K extends keyof Settings[T]
  > = Settings[T][K]

  const updateSetting = <T extends SectionKeys, K extends keyof Settings[T]>(
    section: T,
    key: K,
    value: FieldValue<T, K>
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) =>
                      updateSetting('general', 'siteName', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) =>
                      updateSetting('general', 'contactEmail', e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) =>
                    updateSetting('general', 'siteDescription', e.target.value)
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.general.supportPhone}
                    onChange={(e) =>
                      updateSetting('general', 'supportPhone', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) =>
                      updateSetting('general', 'timezone', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.general.currency}
                    onValueChange={(value) =>
                      updateSetting('general', 'currency', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('General')}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important events
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting(
                        'notifications',
                        'emailNotifications',
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new orders are placed
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.orderNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting(
                        'notifications',
                        'orderNotifications',
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Inventory Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts when inventory is low
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.inventoryAlerts}
                    onCheckedChange={(checked) =>
                      updateSetting('notifications', 'inventoryAlerts', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Customer Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to customers about their orders
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.customerNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting(
                        'notifications',
                        'customerNotifications',
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Send promotional emails to customers
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={(checked) =>
                      updateSetting('notifications', 'marketingEmails', checked)
                    }
                  />
                </div>
              </div>

              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('Notification')}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">
                    Free Shipping Threshold ($)
                  </Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={settings.shipping.freeShippingThreshold}
                    onChange={(e) =>
                      updateSetting(
                        'shipping',
                        'freeShippingThreshold',
                        Number.parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processingTime">Processing Time</Label>
                  <Input
                    id="processingTime"
                    value={settings.shipping.processingTime}
                    onChange={(e) =>
                      updateSetting(
                        'shipping',
                        'processingTime',
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="standardShippingRate">
                    Standard Shipping Rate ($)
                  </Label>
                  <Input
                    id="standardShippingRate"
                    type="number"
                    step="0.01"
                    value={settings.shipping.standardShippingRate}
                    onChange={(e) =>
                      updateSetting(
                        'shipping',
                        'standardShippingRate',
                        Number.parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expressShippingRate">
                    Express Shipping Rate ($)
                  </Label>
                  <Input
                    id="expressShippingRate"
                    type="number"
                    step="0.01"
                    value={settings.shipping.expressShippingRate}
                    onChange={(e) =>
                      updateSetting(
                        'shipping',
                        'expressShippingRate',
                        Number.parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>International Shipping</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable shipping to international destinations
                  </p>
                </div>
                <Switch
                  checked={settings.shipping.internationalShipping}
                  onCheckedChange={(checked) =>
                    updateSetting('shipping', 'internationalShipping', checked)
                  }
                />
              </div>

              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('Shipping')}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Accept Credit Cards</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept Visa, MasterCard, American Express
                    </p>
                  </div>
                  <Switch
                    checked={settings.payments.acceptCreditCards}
                    onCheckedChange={(checked) =>
                      updateSetting('payments', 'acceptCreditCards', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Accept PayPal</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable PayPal payments
                    </p>
                  </div>
                  <Switch
                    checked={settings.payments.acceptPaypal}
                    onCheckedChange={(checked) =>
                      updateSetting('payments', 'acceptPaypal', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Accept Cryptocurrency</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept Bitcoin and other cryptocurrencies
                    </p>
                  </div>
                  <Switch
                    checked={settings.payments.acceptCrypto}
                    onCheckedChange={(checked) =>
                      updateSetting('payments', 'acceptCrypto', checked)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={settings.payments.taxRate}
                    onChange={(e) =>
                      updateSetting(
                        'payments',
                        'taxRate',
                        Number.parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processingFee">Processing Fee (%)</Label>
                  <Input
                    id="processingFee"
                    type="number"
                    step="0.1"
                    value={settings.payments.processingFee}
                    onChange={(e) =>
                      updateSetting(
                        'payments',
                        'processingFee',
                        Number.parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('Payment')}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    updateSetting('security', 'twoFactorAuth', checked)
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      updateSetting(
                        'security',
                        'sessionTimeout',
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.security.passwordExpiry}
                    onChange={(e) =>
                      updateSetting(
                        'security',
                        'passwordExpiry',
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={settings.security.loginAttempts}
                    onChange={(e) =>
                      updateSetting(
                        'security',
                        'loginAttempts',
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Textarea
                  id="ipWhitelist"
                  placeholder="Enter IP addresses separated by commas"
                  value={settings.security.ipWhitelist}
                  onChange={(e) =>
                    updateSetting('security', 'ipWhitelist', e.target.value)
                  }
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to allow access from any IP address
                </p>
              </div>

              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('Security')}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
