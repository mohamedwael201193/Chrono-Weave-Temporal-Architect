import * as wagmi from 'wagmi';
import { Connector, Chain, ConnectorData, Address, WalletClient, useSwitchNetwork as useSwitchNetwork$1, configureChains } from 'wagmi';
import { ConnectedWallet, EIP1193Provider } from '@privy-io/react-auth';
import * as _wagmi_core from '@wagmi/core';
import React, { FC } from 'react';

declare class PrivyConnector extends Connector {
    #private;
    readonly id = "privy";
    readonly name = "Privy";
    activeWallet?: ConnectedWallet;
    protected provider?: EIP1193Provider;
    protected readonly logoutFromPrivy: () => Promise<void>;
    constructor({ logout, chains, activeWallet, }: {
        logout: () => Promise<void>;
        chains?: Chain[];
        activeWallet?: ConnectedWallet;
    });
    get ready(): boolean;
    getActiveWallet(): ConnectedWallet | undefined;
    setActiveWallet(newActiveWallet: ConnectedWallet): Promise<void>;
    connect({ chainId }?: {
        chainId?: number;
    }): Promise<Required<ConnectorData>>;
    disconnect(): Promise<void>;
    getAccount(): Promise<Address>;
    getChainId(): Promise<number>;
    getProvider(): Promise<EIP1193Provider>;
    getWalletClient({ chainId }?: {
        chainId?: number;
    }): Promise<WalletClient>;
    isAuthorized(): Promise<boolean>;
    switchChain(chainId: number): Promise<Chain>;
    protected onAccountsChanged(accounts: string[]): void;
    protected onChainChanged: (chainId: number | string) => void;
    protected onDisconnect(error?: Error): Promise<void>;
}

type ConfigureChainsReturnType = ReturnType<typeof configureChains>;
/** Props for the `PrivyWagmiConnector` component. */
interface PrivyWagmiConnectorProps {
    children: React.ReactNode;
    wagmiChainsConfig: ConfigureChainsReturnType;
    privyConnectorOverride?: Connector;
}
/**
 * React Context that synchronizes Privy and Wagmi. This should wrap any component that
 * will use Privy or wagmi in the consuming application, and should be nested inside
 * the `PrivyProvider`.
 */
declare const PrivyWagmiConnector: FC<PrivyWagmiConnectorProps>;
/**
 * Hook to allow apps to get the current active wallet, set the current active wallet,
 * and determine if Privy has fully initialized.
 */
declare const usePrivyWagmi: () => {
    ready: boolean;
    wallet: ConnectedWallet | undefined;
    setActiveWallet: (wallet?: ConnectedWallet) => void;
};
/**
 * Shim for the useSwitchNetwork hook that ensures that `switchNetwork` is never undefined.
 * Accepts the same configuration parameters as wagmi's regular `useSwitchNetwork`.
 */
declare const useSwitchNetwork: (opts?: Parameters<typeof useSwitchNetwork$1>[0]) => {
    readonly chains: wagmi.Chain[];
    readonly data: _wagmi_core.SwitchNetworkResult | undefined;
    readonly error: Error | null;
    readonly isError: boolean;
    readonly isIdle: boolean;
    readonly isLoading: boolean;
    readonly isSuccess: boolean;
    readonly pendingChainId: number | undefined;
    readonly reset: () => void;
    readonly status: "error" | "idle" | "success" | "loading";
    readonly switchNetwork: ((chainId_?: number | undefined) => void) | undefined;
    readonly switchNetworkAsync: ((chainId_?: number | undefined) => Promise<_wagmi_core.SwitchNetworkResult>) | undefined;
    readonly variables: _wagmi_core.SwitchNetworkArgs | undefined;
};

export { PrivyConnector, PrivyWagmiConnector, usePrivyWagmi, useSwitchNetwork };
