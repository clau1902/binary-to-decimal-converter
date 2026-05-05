"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Search = {
  id: number;
  inputType: string;
  inputValue: string;
  decimalResult: string;
  createdAt: string;
};

export default function Home() {
  const [binary, setBinary] = useState("");
  const [hexadecimal, setHexadecimal] = useState("");
  const [decimal, setDecimal] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [savedSearches, setSavedSearches] = useState<Search[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("binary");

  const handleBinaryChange = (value: string) => {
    // Only allow 0s and 1s
    if (value === "" || /^[01]+$/.test(value)) {
      setBinary(value);
      setError("");
      
      if (value === "") {
        setDecimal(null);
      } else {
        try {
          const decimalValue = parseInt(value, 2);
          setDecimal(decimalValue);
        } catch (err) {
          setError("Invalid binary number");
          setDecimal(null);
        }
      }
    } else {
      setError("Only 0s and 1s are allowed");
    }
  };

  const handleHexadecimalChange = (value: string) => {
    // Only allow 0-9 and A-F (case insensitive)
    const upperValue = value.toUpperCase();
    if (value === "" || /^[0-9A-F]+$/i.test(value)) {
      setHexadecimal(upperValue);
      setError("");
      
      if (value === "") {
        setDecimal(null);
      } else {
        try {
          const decimalValue = parseInt(upperValue, 16);
          setDecimal(decimalValue);
        } catch (err) {
          setError("Invalid hexadecimal number");
          setDecimal(null);
        }
      }
    } else {
      setError("Only 0-9 and A-F are allowed");
    }
  };

  const handleClear = () => {
    setBinary("");
    setHexadecimal("");
    setDecimal(null);
    setError("");
  };

  const loadSearches = async () => {
    try {
      const response = await fetch("/api/searches");
      if (response.ok) {
        const data = await response.json();
        setSavedSearches(data);
      }
    } catch (err) {
      console.error("Error loading searches:", err);
    }
  };

  useEffect(() => {
    loadSearches();
  }, []);

  const handleSave = async () => {
    if (decimal === null || error) return;

    const inputType = activeTab;
    const inputValue = activeTab === "binary" ? binary : hexadecimal;

    if (!inputValue) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/searches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputType,
          inputValue,
          decimalResult: decimal.toString(),
        }),
      });

      if (response.ok) {
        await loadSearches();
      }
    } catch (err) {
      console.error("Error saving search:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSearch = (search: Search) => {
    if (search.inputType === "binary") {
      setActiveTab("binary");
      setBinary(search.inputValue);
      setHexadecimal("");
    } else {
      setActiveTab("hexadecimal");
      setHexadecimal(search.inputValue);
      setBinary("");
    }
    setDecimal(parseInt(search.decimalResult));
    setError("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-4xl font-bold">Number Converter</CardTitle>
            <CardDescription className="text-lg">
              Convert binary or hexadecimal numbers to decimal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="binary" className="text-base">Binary</TabsTrigger>
                <TabsTrigger value="hexadecimal" className="text-base">Hexadecimal</TabsTrigger>
              </TabsList>
            
            <TabsContent value="binary" className="space-y-6 mt-6">
              <div className="space-y-3">
                <label htmlFor="binary-input" className="text-base font-medium">
                  Binary Number
                </label>
                <div className="w-full overflow-hidden">
                  <Input
                    id="binary-input"
                    type="text"
                    placeholder="e.g., 1010"
                    value={binary}
                    onChange={(e) => handleBinaryChange(e.target.value)}
                    className={`text-lg h-12 ${error ? "border-destructive" : ""}`}
                  />
                </div>
                {error && (
                  <p className="text-base text-destructive">{error}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="hexadecimal" className="space-y-6 mt-6">
              <div className="space-y-3">
                <label htmlFor="hexadecimal-input" className="text-base font-medium">
                  Hexadecimal Number
                </label>
                <div className="w-full overflow-hidden">
                  <Input
                    id="hexadecimal-input"
                    type="text"
                    placeholder="e.g., FF or 1A3"
                    value={hexadecimal}
                    onChange={(e) => handleHexadecimalChange(e.target.value)}
                    className={`text-lg h-12 ${error ? "border-destructive" : ""}`}
                  />
                </div>
                {error && (
                  <p className="text-base text-destructive">{error}</p>
                )}
              </div>
            </TabsContent>
            </Tabs>

            {decimal !== null && !error && (
              <div className="space-y-3">
                <label className="text-base font-medium">Decimal Result</label>
                <div className="rounded-md border border-border bg-muted p-6 overflow-hidden w-full">
                  <p className="text-4xl font-bold text-foreground break-words break-all">{decimal.toLocaleString()}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                className="flex-1 h-12 text-base"
                disabled={decimal === null || !!error || isSaving}
              >
                {isSaving ? "Saving..." : "Save Search"}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="flex-1 h-12 text-base"
                disabled={!binary && !hexadecimal && decimal === null}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Conversions History</CardTitle>
              <CardDescription>
                Your saved conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedSearches.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No saved conversions yet. Save a conversion to see it here.
                </p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {savedSearches.map((search) => (
                    <div
                      key={search.id}
                      className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleLoadSearch(search)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                              {search.inputType.toUpperCase()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(search.createdAt)}
                            </span>
                          </div>
                          <p className="text-base font-medium break-all">
                            {search.inputValue} → {parseInt(search.decimalResult).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
