import React, { ReactElement, useState } from "react"
import {
  EstimatedFeesPerGas,
  NetworkFeeSettings,
  setFeeType,
} from "@tallyho/tally-background/redux-slices/transaction-construction"
import {
  selectDefaultNetworkFeeSettings,
  selectTransactionData,
} from "@tallyho/tally-background/redux-slices/selectors/transactionConstructionSelectors"
import { EIP_1559_COMPLIANT_CHAIN_IDS } from "@tallyho/tally-background/constants"
import { useBackgroundDispatch, useBackgroundSelector } from "../../hooks"
import NetworkSettingsSelect from "./NetworkSettingsSelect"
import NetworkSettingsOptimism from "./NetworkSettingsSelectOptimism"

interface NetworkSettingsChooserProps {
  estimatedFeesPerGas: EstimatedFeesPerGas | undefined
  onNetworkSettingsSave: (setting: NetworkFeeSettings) => void
}

export default function NetworkSettingsChooser({
  estimatedFeesPerGas,
  onNetworkSettingsSave,
}: NetworkSettingsChooserProps): ReactElement {
  const [networkSettings, setNetworkSettings] = useState(
    useBackgroundSelector(selectDefaultNetworkFeeSettings)
  )
  const transactionDetails = useBackgroundSelector(selectTransactionData)

  const dispatch = useBackgroundDispatch()

  const saveNetworkSettings = async () => {
    await dispatch(setFeeType(networkSettings.feeType))
    onNetworkSettingsSave(networkSettings)
  }

  return (
    <>
      <div className="wrapper">
        {transactionDetails &&
        EIP_1559_COMPLIANT_CHAIN_IDS.has(transactionDetails.network.chainID) ? (
          <NetworkSettingsSelect
            estimatedFeesPerGas={estimatedFeesPerGas}
            networkSettings={networkSettings}
            onNetworkSettingsChange={setNetworkSettings}
            onSave={saveNetworkSettings}
          />
        ) : (
          <NetworkSettingsOptimism />
        )}
      </div>
      <style jsx>
        {`
          .wrapper {
            height: 100%;
            display: flex;
            flex-flow: column;
            margin-left: 12px;
            align-items: center;
          }
        `}
      </style>
    </>
  )
}
