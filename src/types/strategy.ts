import { BigNumber } from 'ethers';
import { Token } from './token';

export type StrategyParams = {
    activation: string;
    performanceFee: string;
    debtRatio: BigNumber;
    lastReportText: string;
    totalDebt: BigNumber;
    totalGain: BigNumber;
    totalLoss: BigNumber;
    rateLimit?: BigNumber;
    minDebtPerHarvest?: BigNumber;
    maxDebtPerHarvest?: BigNumber;
};

export type Strategy = {
    apiVersion: string;
    name: string;
    address: string;
    vault: string;
    token: Token;

    emergencyExit: boolean;
    isActive: boolean;

    strategist: string;
    keeper: string;
    rewards: string;

    withdrawalQueueIndex: number;
    // params
    estimatedTotalAssets: BigNumber;
    delgatedAssets: BigNumber;
    debtOutstanding: BigNumber;
    creditAvailable: BigNumber;
    expectedReturn: BigNumber;

    debtRatio: BigNumber;
    totalDebt: BigNumber;
    lastReport: BigNumber;

    params: StrategyParams;
};
