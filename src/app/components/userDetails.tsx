"use client";
import React, { useEffect, useState } from "react";
import DetailLabel from "./detailLabel";
import TrustList from "./deatilsTrustList";
import { ethers } from "ethers";

interface Trustee {
  flowRate: string;
  id: string;
}

interface Member {
  id: string;
  inFlowRate: string;
  outFlowRate: string;
  trustScore: string;
  trustees: Trustee[];
  trusters: Trustee[];
}

interface DetailsProps {
  memberId: string;
}

export default function Details({ memberId }: DetailsProps) {
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMemberData();
  }, [memberId]); // Add memberId to dependency array

  const fetchMemberData = async () => {
    try {
      const response = await fetch(
        "https://api.studio.thegraph.com/query/59211/trustsquared/version/latest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query MyQuery {
                member(id: "${memberId}") {
                  id
                  inFlowRate
                  outFlowRate
                  trustScore
                  trustees {
                    flowRate
                    id
                  }
                  trusters {
                    flowRate
                    id
                  }
                }
              }
            `,
          }),
        }
      );
      const data = await response.json();
      console.log("data", data);
      setMemberData(data.data.member);
    } catch (err) {
      setError("Failed to fetch member data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatFlowRate = (rate: string, sign: 1 | -1 = 1) => {
    let val = ethers.formatUnits(Number(rate));
    let resp = val + " /s";
    if (sign == -1) resp = "-" + resp;
    return resp;
  };

  const formatScore = (rate: string) => {
    let val = ethers.formatUnits(Number(rate));

    return val + " ☘️";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No data found</div>
      </div>
    );
  }

  return (
    <div className="p-4 m-2 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Member Details</h1>
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <DetailLabel label="Address" value={formatAddress(memberData.id)} />
        <DetailLabel
          label="Trust Score"
          value={formatScore(memberData.trustScore)}
        />
        <DetailLabel
          label="In Flow Rate"
          value={formatFlowRate(memberData.inFlowRate)}
        />
        <DetailLabel
          label="Out Flow Rate"
          value={formatFlowRate(memberData.outFlowRate, -1)}
        />
        <DetailLabel
          label="Net Flow Rate"
          value={formatFlowRate(
            (
              Number(memberData.inFlowRate) - Number(memberData.outFlowRate)
            ).toString()
          )}
        />
      </div>

      <TrustList
        trusts={memberData.trustees}
        formatFlowRate={formatFlowRate}
        formatAddress={formatAddress}
        title="Trustee"
      />
      <TrustList
        trusts={memberData.trusters}
        formatFlowRate={formatFlowRate}
        formatAddress={formatAddress}
        title="Truster"
      />
    </div>
  );
}
