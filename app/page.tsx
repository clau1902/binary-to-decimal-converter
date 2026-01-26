"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [binary, setBinary] = useState("");
  const [hexadecimal, setHexadecimal] = useState("");
  const [decimal, setDecimal] = useState<number | null>(null);
  const [error, setError] = useState("");

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Number Converter</CardTitle>
          <CardDescription className="text-lg">
            Convert binary or hexadecimal numbers to decimal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="binary" className="w-full">
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

          <Button
            onClick={handleClear}
            variant="outline"
            className="w-full h-12 text-base"
            disabled={!binary && !hexadecimal && decimal === null}
          >
            Clear
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
