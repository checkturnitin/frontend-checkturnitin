"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Copy, Eye, EyeOff, Trash2, Plus, Key, BarChart3, Calendar, AlertCircle } from "lucide-react";

import { serverURL } from "@/utils/utils";
import Header from "../header";
import ElegantFooter from "../last";
import SignupForm from "../signup/SignupForm";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface APIKey {
  id: string;
  userId: string;
  name: string;
  apiKey?: string; // Only present on creation; sanitized in list
  totalChecks: number;
  checksUsed: number;
  checksRemaining: number;
  status: 'active' | 'inactive';
  expiresAt: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
  metadata?: Record<string, unknown>;
}

interface APIKeyStats {
  totalKeys: number;
  activeKeys: number;
  totalChecks: number;
  expiredKeys: number;
}

interface CreateAPIKeyRequest {
  name: string;
  totalChecks: number;
  expiresAt: string;
  permissions: string[];
}

export default function APIKeyManagementPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [stats, setStats] = useState<APIKeyStats>({ totalKeys: 0, activeKeys: 0, totalChecks: 0, expiredKeys: 0 });
  const [revokeDialogForId, setRevokeDialogForId] = useState<string | null>(null);
  const [revokeApiKeyInput, setRevokeApiKeyInput] = useState<string>("");
  const [revokeSubmitting, setRevokeSubmitting] = useState<boolean>(false);
  const [showCreatedKeyDialog, setShowCreatedKeyDialog] = useState<boolean>(false);
  const [createdKeyToken, setCreatedKeyToken] = useState<string>("");
  const [createdKeyName, setCreatedKeyName] = useState<string>("");
  const [viewKeyDialogForId, setViewKeyDialogForId] = useState<string | null>(null);
  const [viewKeyToken, setViewKeyToken] = useState<string>("");
  const [viewKeyName, setViewKeyName] = useState<string>("");

  // Create API Key form state
  const [createForm, setCreateForm] = useState<CreateAPIKeyRequest>({
    name: '',
    totalChecks: 100,
    expiresAt: '',
    permissions: ['read', 'write']
  });

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchAPIKeys(storedToken);
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  }, []);

  const fetchAPIKeys = async (authToken: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${serverURL}/api/keys`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      const data = response.data as { stats: APIKeyStats; keys: APIKey[] };
      setApiKeys(data.keys || []);
      setStats(data.stats || { totalKeys: 0, activeKeys: 0, totalChecks: 0, expiredKeys: 0 });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to fetch API keys");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAPIKey = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Calculate expiration date (30 days from now if not specified)
      const expiresAt = createForm.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const response = await axios.post(`${serverURL}/api/key/generate`, {
        ...createForm,
        expiresAt
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Add the new API key (includes plaintext apiKey only this time)
      setApiKeys(prev => [...prev, response.data]);
      // Open created-key dialog to display plaintext token ONCE
      if (response.data?.apiKey) {
        setCreatedKeyToken(response.data.apiKey as string);
        setCreatedKeyName(response.data?.name || "New API Key");
        setShowCreatedKeyDialog(true);
      }
      // Refresh stats from server
      if (token) {
        fetchAPIKeys(token);
      }
      
      // Reset form and close dialog
      setCreateForm({
        name: '',
        totalChecks: 100,
        expiresAt: '',
        permissions: ['read', 'write']
      });
      setShowCreateDialog(false);
      
      // Show the API key to the user
      setShowApiKey(response.data.id);
      
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create API key");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAPIKey = async (apiKeyToken: string) => {
    if (!token) return;
    
    try {
      setRevokeSubmitting(true);
      setError(null);
      
      const response = await axios.post(`${serverURL}/api/key/revoke`, {
        apiKey: apiKeyToken
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh list and stats after revoke
      if (token) {
        await fetchAPIKeys(token);
      }
      setRevokeDialogForId(null);
      setRevokeApiKeyInput("");
      
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to revoke API key");
    } finally {
      setRevokeSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const getPermissionBadges = (permissions: string[]) => {
    return permissions.map(permission => (
      <Badge key={permission} variant="outline" className="text-xs">
        {permission}
      </Badge>
    ));
  };

  if (!isLoggedIn) {
    return (
      <main className="relative flex flex-col w-full min-h-screen bg-white text-gray-900 overflow-hidden dark:bg-black dark:text-white">
        <Header onShowSignupForm={() => setShowSignupForm(true)} />
        
        <section className="flex-1 px-4 pt-28 pb-16 flex flex-col items-center">
          <div className="w-full max-w-2xl text-center">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Key className="h-8 w-8 text-blue-600" />
                  API Key Management
                </CardTitle>
                <CardDescription>
                  Please log in to manage your API keys for programmatic access to our services.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowSignupForm(true)} className="w-full">
                  Sign In / Sign Up
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <ElegantFooter />
        {showSignupForm && <SignupForm onClose={() => setShowSignupForm(false)} />}
      </main>
    );
  }

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-white text-gray-900 overflow-hidden dark:bg-black dark:text-white">
      <Header onShowSignupForm={() => setShowSignupForm(true)} />

      <section className="flex-1 px-4 pt-28 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Key className="h-10 w-10 text-blue-600" />
              API Key Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Create and manage API keys for programmatic access to our Turnitin checking services.
              Use these keys to integrate our plagiarism detection into your applications.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Key className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalKeys}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Keys</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.activeKeys}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Keys</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalChecks}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Checks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.expiredKeys}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expired Keys</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Main Content */}
          <Tabs defaultValue="keys" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="keys">API Keys</TabsTrigger>
              <TabsTrigger value="create">Create New Key</TabsTrigger>
            </TabsList>

            <TabsContent value="keys" className="space-y-4">
              {/* Create Key Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Your API Keys</h2>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create New Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>
                        Create a new API key with specific permissions and limits.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Key Name</Label>
                        <Input
                          id="name"
                          placeholder="My API Key"
                          value={createForm.name}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="totalChecks">Total Checks</Label>
                        <Input
                          id="totalChecks"
                          type="number"
                          min="1"
                          value={createForm.totalChecks}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, totalChecks: parseInt(e.target.value) || 1 }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                        <Input
                          id="expiresAt"
                          type="datetime-local"
                          value={createForm.expiresAt}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label>Permissions</Label>
                        <div className="flex gap-2 mt-2">
                          {['read', 'write'].map(permission => (
                            <Badge
                              key={permission}
                              variant={createForm.permissions.includes(permission) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const newPermissions = createForm.permissions.includes(permission)
                                  ? createForm.permissions.filter(p => p !== permission)
                                  : [...createForm.permissions, permission];
                                setCreateForm(prev => ({ ...prev, permissions: newPermissions }));
                              }}
                            >
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleCreateAPIKey} 
                          disabled={!createForm.name || isLoading}
                          className="flex-1"
                        >
                          {isLoading ? "Creating..." : "Create Key"}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowCreateDialog(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* API Keys List */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading API keys...</p>
                </div>
              ) : apiKeys.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Key className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No API Keys Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Create your first API key to start integrating our services programmatically.
                    </p>
                    <Button onClick={() => setShowCreateDialog(true)}>
                      Create Your First Key
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <Card key={apiKey.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold">{apiKey.name}</h3>
                              {getStatusBadge(apiKey.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">API Key</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                    {apiKey.apiKey ? '••••••••••••••••' : 'Shown only on creation'}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (apiKey.apiKey) {
                                        setViewKeyDialogForId(apiKey.id);
                                        setViewKeyToken(apiKey.apiKey);
                                        setViewKeyName(apiKey.name);
                                      }
                                    }}
                                    disabled={!apiKey.apiKey}
                                    title={apiKey.apiKey ? 'View API Key' : 'Key not available to view'}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Checks</p>
                                <p className="font-semibold">
                                  {apiKey.checksRemaining} / {apiKey.totalChecks} remaining
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${(apiKey.checksRemaining / apiKey.totalChecks) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Expires</p>
                                <p className="font-semibold">{formatDate(apiKey.expiresAt)}</p>
                                {new Date(apiKey.expiresAt) < new Date() && (
                                  <Badge variant="destructive" className="mt-1">Expired</Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Permissions:</span>
                              {getPermissionBadges(apiKey.permissions)}
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              Created: {formatDate(apiKey.createdAt)}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            {apiKey.status === 'active' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setRevokeDialogForId(apiKey.id);
                                    setRevokeApiKeyInput("");
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Revoke
                                </Button>
                                <Dialog open={revokeDialogForId === apiKey.id} onOpenChange={(open) => {
                                  if (!open) {
                                    setRevokeDialogForId(null);
                                    setRevokeApiKeyInput("");
                                  }
                                }}>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Revoke API Key</DialogTitle>
                                      <DialogDescription>
                                        Paste the plaintext API key token to confirm revocation. This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor={`revoke-key-${apiKey.id}`}>API Key Token</Label>
                                        <Input
                                          id={`revoke-key-${apiKey.id}`}
                                          type="password"
                                          placeholder="tk_..."
                                          value={revokeApiKeyInput}
                                          onChange={(e) => setRevokeApiKeyInput(e.target.value)}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">For security, keys are not stored in plaintext. You must paste the token to revoke.</p>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          onClick={() => handleRevokeAPIKey(revokeApiKeyInput)}
                                          disabled={!revokeApiKeyInput || revokeSubmitting}
                                          className="flex-1"
                                        >
                                          {revokeSubmitting ? "Revoking..." : "Confirm Revoke"}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setRevokeDialogForId(null);
                                            setRevokeApiKeyInput("");
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New API Key</CardTitle>
                  <CardDescription>
                    Generate a new API key with custom permissions and limits for programmatic access.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="create-name">Key Name *</Label>
                      <Input
                        id="create-name"
                        placeholder="e.g., Production API Key"
                        value={createForm.name}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Give your key a descriptive name for easy identification
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="create-checks">Total Checks *</Label>
                      <Input
                        id="create-checks"
                        type="number"
                        min="1"
                        value={createForm.totalChecks}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, totalChecks: parseInt(e.target.value) || 1 }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum number of checks this key can perform
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="create-expires">Expiration Date (Optional)</Label>
                    <Input
                      id="create-expires"
                      type="datetime-local"
                      value={createForm.expiresAt}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to set expiration to 30 days from now
                    </p>
                  </div>
                  
                  <div>
                    <Label>Permissions *</Label>
                    <div className="flex gap-2 mt-2">
                      {['read', 'write'].map(permission => (
                        <Badge
                          key={permission}
                          variant={createForm.permissions.includes(permission) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newPermissions = createForm.permissions.includes(permission)
                              ? createForm.permissions.filter(p => p !== permission)
                              : [...createForm.permissions, permission];
                            setCreateForm(prev => ({ ...prev, permissions: newPermissions }));
                          }}
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Select the permissions this key should have
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Important Notes:</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• API keys are only shown once upon creation - save them securely</li>
                      <li>• Keys can be revoked at any time but cannot be reactivated</li>
                      <li>• Use minimal required permissions for security</li>
                      <li>• Monitor usage to avoid exceeding limits</li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleCreateAPIKey} 
                      disabled={!createForm.name || isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "Creating..." : "Create API Key"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setCreateForm({
                          name: '',
                          totalChecks: 100,
                          expiresAt: '',
                          permissions: ['read', 'write']
                        });
                      }}
                    >
                      Reset Form
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* API Documentation Link */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Need Help with Integration?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Check out our comprehensive API documentation for examples and integration guides.
                </p>
                <Button variant="outline" className="gap-2">
                  <Key className="h-4 w-4" />
                  View API Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <ElegantFooter />
      {showSignupForm && <SignupForm onClose={() => setShowSignupForm(false)} />}

      {/* Created API Key Dialog (shows plaintext ONCE) */}
      <Dialog open={showCreatedKeyDialog} onOpenChange={(open) => setShowCreatedKeyDialog(open)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Copy Your New API Key</DialogTitle>
            <DialogDescription>
              This key is shown only once. Store it securely. You will not be able to view it again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Key Name</Label>
              <div className="mt-1 text-sm font-medium">{createdKeyName}</div>
            </div>
            <div>
              <Label>API Key</Label>
              <div className="mt-1 flex items-center gap-2">
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded break-all">
                  {createdKeyToken}
                </code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(createdKeyToken, "created")}>{copiedKey === "created" ? "Copied!" : <Copy className="h-4 w-4" />}</Button>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                Warning: You cannot retrieve this token later. Save it now.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowCreatedKeyDialog(false)}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View API Key Dialog (for inline view without layout shift) */}
      <Dialog open={!!viewKeyDialogForId} onOpenChange={(open) => {
        if (!open) {
          setViewKeyDialogForId(null);
          setViewKeyToken("");
          setViewKeyName("");
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>View API Key</DialogTitle>
            <DialogDescription>
              This is the plaintext token of your API key. Store it securely.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Key Name</Label>
              <div className="mt-1 text-sm font-medium">{viewKeyName}</div>
            </div>
            <div>
              <Label>API Key</Label>
              <div className="mt-1 flex items-center gap-2">
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded break-all">
                  {viewKeyToken}
                </code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(viewKeyToken, "view")}>{copiedKey === "view" ? "Copied!" : <Copy className="h-4 w-4" />}</Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setViewKeyDialogForId(null)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
