<?php

namespace App\Controllers;

use App\Base\Controller;

class ApiController extends Controller {

    public function balanceGet(){
        $em =  $this->container->get('db')->get('em')->getEntityManager();
        $balance = $em
        ->getRepository('Balance')
        ->createQueryBuilder('c')
        ->getQuery()
        ->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
        //$em->getRepository("Balance")->findAll()
        $data = $balance ?? [];
        $response = $this->container->get('response')->withJson($data);
        return $response;
    }

    public function balanceAdd(){
        $post = $this->container->get('request')->getParsedBody();

        $em =  $this->container->get('db')->get('em')->getEntityManager();
        $balance = $em
          ->getRepository('Balance')
          ->createQueryBuilder('c')
          ->getQuery()
          ->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY) ?? [];
    
        $total = 0;
        forEach($balance as $item) {
            if ($item['type'] == 'debit') {
                $total -= $item['amount'];
            }
            if ($item['type'] == 'credit') {
                $total += $item['amount'];
            }
        }
                    
        if($post['type'] == 'debit' && $total < $post['amount']){
            $data = ['message' => 'Operation error. Balance will be below zero.'];
            return $this->container->get('response')->withJson($data)->withStatus(400);
        }
    
        if(!in_array($post['type'],['debit','credit'])){
            $data = ['message' => 'Invalid type'];
            return $this->container->get('response')->withJson($data)->withStatus(400);
        }
    
        if($post['amount'] < 0){
            $data = ['message' => 'Invalid amount'];
            return $this->container->get('response')->withJson($data)->withStatus(400);
        }
    
        $id = count($balance) + 1;

        $balance = new \Balance;
        $balance->setType($post['type']);
        $balance->setAmount($post['amount']);
        $balance->setAdded(time());
        $em->persist($balance);
        $em->flush();
        $data = [
            'success' => true,
            'id' => $balance->getId()
        ];
        $response = $this->container->get('response')->withJson($data);
        return $response;
    }

    public function balanceClear(){
        $em =  $this->container->get('db')->get('em')->getEntityManager();
        $q = $em->createQuery('DELETE FROM Balance')->execute();
        $data = ['ok' => true];
        $response = $this->container->get('response')->withJson($data);
        return $response;
    }

    public function balanceDelete($request, $response, $args){
        $em =  $this->container->get('db')->get('em')->getEntityManager();
        $id = $args['id'] ?? '';
        $balance = $em->find('Balance', $id);

        $balances = $em
          ->getRepository('Balance')
          ->createQueryBuilder('c')
          ->getQuery()
          ->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY) ?? [];
    
        $total = 0;
        forEach($balances as $item) {
            if ($item['type'] == 'debit') {
                $total -= $item['amount'];
            }
            if ($item['type'] == 'credit') {
                $total += $item['amount'];
            }
        }
                    
        if($balance->getType() == 'credit' && $total - $balance->getAmount() < 0){
            $data = ['message' => 'Operation error. Balance will be below zero.'];
            return $this->container->get('response')->withJson($data)->withStatus(400);
        }


        $em->remove($balance);
        $em->flush();
        $data = [
            'success' => true,
        ];
        $response = $this->container->get('response')->withJson($data);
        return $response;
    }

    public function test($request, $response, $args){
        
    }

    public function balanceEdit($request, $response, $args){
        $id = $args['id'] ?? '';
        $post = $this->container->get('request')->getParsedBody();
        $em =  $this->container->get('db')->get('em')->getEntityManager();

        //$item = $em->getRepository("Balance")->find($id);
        $balance = $em->find('Balance', $id);
        if(!$balance){
            $data = ['message' => 'Balance not found'];
            return $this->container->get('response')->withJson($data)->withStatus(400);
        }

        $balances = $em
        ->getRepository('Balance')
        ->createQueryBuilder('c')
        ->getQuery()
        ->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY) ?? [];
        $total = 0;
        forEach($balances as $item) {
          if ($item['type'] == 'debit') {
              $total -= $item['amount'];
          }
          if ($item['type'] == 'credit') {
              $total += $item['amount'];
          }
        }
    
        if(!in_array($post['type'],['debit','credit'])){
            $data = ['message' => 'Invalid type'];
            return $this->container->get('response')->withJson($data)->withStatus(400);
        }
    
        if($post['amount'] < 0){
            $data = ['message' => 'Invalid amount'];
            return $this->container->get('response')->withJson($data)->withStatus(400);
        }


        if ($balance->getType() == 'debit') {
            $total += $balance->getAmount();
        }
        if ($balance->getType() == 'credit') {
            $total -= $balance->getAmount();
        }

        $badDebitCondition = $post['type'] == 'debit' && $total - $post['amount'] < 0;
        $badCreditCondition = $post['type'] == 'credit' && $total + $post['amount'] < 0;
        
        if($badDebitCondition || $badCreditCondition){
            $data = ['message' => 'Operation error. Balance will be below zero.'];
            return $this->container->get('response')->withJson($data)->withStatus(400);
        } 
    
        $balance->setType($post['type']);
        $balance->setAmount((float)$post['amount']);
        $em->persist($balance);
        $em->flush();
        $data = [
            'success' => true,
        ];
        $response = $this->container->get('response')->withJson($data);
        return $response;
    }
}
