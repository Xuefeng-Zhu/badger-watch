import { useAsync } from 'react-use';
import { CheckCircle } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';

import CardContent from './CardContent';
import { Strategy } from '../../../types';
import { useWeb3Context } from '../../../providers/Web3ContextProvider';
import { formatBPS, displayAmount } from '../../../utils/commonUtils';
import { checkLabel } from '../../../utils/checks';
import { getKeyValues } from '../../../utils/registry';

type StrategyDetailProps = {
    strategy: Strategy;
};
export const StrategyDetail = (props: StrategyDetailProps) => {
    const { strategy } = props;
    const { provider, badgerRegistry } = useWeb3Context();

    const { value: keyValues } = useAsync(async () => {
        if (!provider) {
            return;
        }

        return await getKeyValues(badgerRegistry, provider, [
            'controller',
            'governance',
            'keeper',
        ]);
    }, [provider]);

    const controller = (
        <>
            {checkLabel(strategy.controller)}

            {strategy.controller == keyValues?.controller && (
                <CheckCircle style={{ color: green[500] }} />
            )}
        </>
    );
    const governance = (
        <>
            {checkLabel(strategy.governance)}

            {strategy.governance == keyValues?.governance && (
                <CheckCircle style={{ color: green[500] }} />
            )}
        </>
    );
    const keeper = (
        <>
            {checkLabel(strategy.keeper)}

            {strategy.keeper == keyValues?.keeper && (
                <CheckCircle style={{ color: green[500] }} />
            )}
        </>
    );
    const strategist = (
        <>
            {checkLabel(strategy.strategist)}

            {strategy.strategist == keyValues?.strategist && (
                <CheckCircle style={{ color: green[500] }} />
            )}
        </>
    );

    const want = <>{checkLabel(strategy.want)}</>;

    const performanceFeeGovernance = formatBPS(
        strategy.performanceFeeGovernance.toString()
    );
    const performanceFeeStrategist = formatBPS(
        strategy.performanceFeeStrategist.toString()
    );
    const withdrawalFee = formatBPS(strategy.withdrawalFee.toString());
    const withdrawalMaxDeviationThreshold = formatBPS(
        strategy.withdrawalMaxDeviationThreshold.toString()
    );

    const data = [
        { key: 'Controller:', value: controller },
        { key: 'Governance:', value: governance },
        { key: 'Keeper:', value: keeper },
        { key: 'Strategist:', value: strategist },
        { key: 'Want:', value: want },
        { key: 'Performance Fee Governance:', value: performanceFeeGovernance },
        { key: 'Performance Fee Strategist:', value: performanceFeeStrategist },
        { key: 'Withdrawal Fee:', value: withdrawalFee },
        {
            key: 'Withdrawal Max Deviation Threshold:',
            value: withdrawalMaxDeviationThreshold,
        },
    ];

    return <CardContent data={data} key={strategy.address} />;
};

export default StrategyDetail;
