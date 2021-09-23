import {
    InternalServerErrorException,
    Injectable,
    OnModuleInit,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ethers } from 'hardhat';
import { providers } from 'ethers';

import { Notary, Notary__factory } from '~/typechain';
import { NotaryContract } from './notary-contract.entity';

@Injectable()
export class NotaryService implements OnModuleInit {
    constructor(
        @InjectRepository(NotaryContract)
        private readonly repository: Repository<NotaryContract>
    ) {}

    async onModuleInit(): Promise<void> {
        try {
            await this.getNotaryContract();
        } catch (e) {
            if (e instanceof NotFoundException) {
                await this.deploy();
                return;
            }

            throw e;
        }
    }

    async getNotaryContract(): Promise<NotaryContract> {
        const contracts = await this.repository.find();

        if (contracts.length < 1) {
            throw new NotFoundException(`Notary contract not deployed`);
        }

        return contracts[0];
    }

    async deploy(): Promise<NotaryContract> {
        if (!process.env.WEB3) {
            throw new InternalServerErrorException(`Please set process.env.WEB3`);
        }

        if (!process.env.DEPLOY_KEY) {
            throw new InternalServerErrorException(`Please set process.env.DEPLOY_KEY`);
        }

        const rpcNode = process.env.WEB3;
        const provider = new providers.JsonRpcProvider(rpcNode);
        const deployKey = process.env.DEPLOY_KEY;

        const adminPK = deployKey.startsWith('0x') ? deployKey : `0x${deployKey}`;

        const notaryFactory: Notary__factory = await ethers.getContractFactory('Notary');

        const notaryContract: Notary = await notaryFactory.deploy();

        return await this.repository.save({
            address: notaryContract.address,
            networkId: provider.network.chainId,
            deployerPrivateKey: adminPK,
            rpcNode
        });
    }
}
