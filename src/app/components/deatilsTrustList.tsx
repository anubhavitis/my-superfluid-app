interface TrustListItems {
  flowRate: string;
  id: string;
}

interface TrustListProps {
  trusts: TrustListItems[];
  formatAddress: (address: string) => string;
  formatFlowRate: (rate: string) => string;
  title: "Trustee" | "Truster";
}

const TrustList = ({
  trusts,
  formatAddress,
  formatFlowRate,
  title,
}: TrustListProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}s</h2>
      <div className="bg-gray-50 rounded-lg p-4">
        {trusts.length === 0 ? (
          <p className="text-gray-500">No {title.toLowerCase()} found</p>
        ) : (
          <div className="space-y-4">
            {trusts.map((trust) => (
              <div
                key={trust.id}
                className="flex justify-between items-center border-b border-gray-200 pb-2"
              >
                <span className="font-mono">
                  <a
                    href={`https://explorer.superfluid.finance/celo/accounts/${
                      trust.id.split("_")[1]
                    }?tab=tokens`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {formatAddress(trust.id.split("_")[1])}
                  </a>
                </span>
                <span
                  className={
                    title === "Trustee" ? "text-red-600" : "text-green-600"
                  }
                >
                  {formatFlowRate(trust.flowRate)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrustList;
